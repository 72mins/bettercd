from django.db import models
import uuid

from apps.base_app.models import CustomUser

from apps.docker_app.services.google_job_client import GoogleJobsClient
from apps.docker_app.services.google_log_client import GoogleLogsClient
from apps.integrations_app.services.github import GithubClient


class Pipeline(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.name}"

    class Meta:
        indexes = [models.Index(fields=["user"])]

    def run_pipeline(self, github_project_id):
        job_client = GoogleJobsClient()
        log_client = GoogleLogsClient()
        github_client = GithubClient()

        github_profile = self.user.githubprofile

        repo_details = github_client.get_repo_details(
            github_profile.access_token, github_project_id
        )

        if not repo_details:
            raise ValueError("Repository not found or access denied.")

        unique_id = uuid.uuid4()
        job_name = f"pipeline-job-{self.id}-{unique_id}"

        stages = self.stage_set.all().order_by("order")

        job_client.create_job(stages, repo_details, job_name, github_profile)
        job_client.run_job(job_name)

        filter = f"resource.type=cloud_run_job AND resource.labels.job_name={job_name} AND severity=DEFAULT"

        log_client.stream_job_logs(log_filter=filter)

        job_client.delete_job(job_name=job_name)
