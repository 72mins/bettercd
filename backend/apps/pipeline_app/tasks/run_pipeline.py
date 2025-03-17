import os
from celery import shared_task
import uuid

from apps.docker_app.services.google_job_client import GoogleJobsClient
from apps.docker_app.services.google_subscriber_client import GoogleSubscriberClient
from apps.integrations_app.models.github import GithubProfile
from apps.integrations_app.services.github import GithubClient

SUBSCRIPTION_ID = os.environ.get("GCLOUD_LOG_SUBSCRIPTION_ID")


@shared_task()
def async_run_pipeline(github_profile_id, pipeline_id):
    from apps.pipeline_app.models.pipeline import Pipeline

    sub_client = GoogleSubscriberClient(SUBSCRIPTION_ID)
    job_client = GoogleJobsClient()
    github_client = GithubClient()

    try:
        github_profile = GithubProfile.objects.get(id=github_profile_id)
    except GithubProfile.DoesNotExist as e:
        print(f"Error getting Github profile: {e}")

    try:
        pipeline = Pipeline.objects.get(id=pipeline_id)
    except Pipeline.DoesNotExist as e:
        print(f"Error getting pipeline: {e}")

    unique_id = uuid.uuid4()
    job_name = f"pipeline-job-{pipeline_id}-{unique_id}"

    variables = pipeline.environmentvariable_set.all()
    stages = pipeline.stage_set.all().order_by("order")

    try:
        github_project_id = stages[0].params["repo_id"]
        github_branch = stages[0].params["repo_branch"]
    except (KeyError, IndexError, Exception) as e:
        print(f"Error getting VCS stage: {e}")

    repo_details = github_client.get_repo_details(
        github_profile.access_token, github_project_id
    )

    if not repo_details:
        print("Failed to get repository details")

    try:
        job_client.create_job(
            stages, variables, repo_details, github_branch, job_name, github_profile
        )

        job_client.run_job(job_name=job_name)
        sub_client.listen_for_logs(job_name=job_name)
    finally:
        job_client.delete_job(job_name=job_name)
