import os

from google.cloud import run_v2
from google.cloud.run_v2 import (
    RunJobRequest,
    DeleteJobRequest,
    GetJobRequest,
    Job,
    Container,
    ResourceRequirements,
    ExecutionTemplate,
    TaskTemplate,
    EnvVar,
)

from apps.docker_app.utils.google_credentials import get_google_credentials


class GoogleJobsClient:
    def __init__(self):
        storage_credentials = get_google_credentials()
        self.client = run_v2.JobsClient(credentials=storage_credentials)

        self.project_id = os.environ.get("GCLOUD_PROJECT_ID")
        self.region = os.environ.get("GCLOUD_REGION")
        self.image = f"{self.region}-docker.pkg.dev/{self.project_id}/script-repo/base-image:latest"

    def get_job(self, job_name: str):
        requst = GetJobRequest(
            name=f"projects/{self.project_id}/locations/{self.region}/jobs/{job_name}"
        )

        job = self.client.get_job(request=requst)

        return job

    def create_job(
        self,
        stages: list,
        variables: list,
        repo_details: dict,
        repo_branch: str,
        job_name: str,
        github_profile,
    ):
        env_vars = [
            EnvVar(name="STAGE_COUNT", value=str(len(stages))),
            EnvVar(name="GITHUB_TOKEN", value=github_profile.access_token),
            EnvVar(name="GITHUB_REPO_URL", value=repo_details["clone_url"]),
            EnvVar(name="GITHUB_REPO_BRANCH", value=repo_branch),
        ]

        for i, stage in enumerate(stages):
            env_vars.extend(
                [
                    EnvVar(name=f"STAGE_{i}_NAME", value=stage.name),
                    EnvVar(name=f"STAGE_{i}_SCRIPT", value=stage.get_script_content()),
                ]
            )

        for var in variables:
            env_vars.append(EnvVar(name=var.name, value=var.value))

        container = Container(
            image=self.image,
            env=env_vars,
            resources=ResourceRequirements(
                limits={
                    "memory": "512Mi",
                    "cpu": "1",
                }
            ),
        )

        job = Job(
            template=ExecutionTemplate(
                template=TaskTemplate(
                    containers=[container],
                    timeout={"seconds": 1200},
                    max_retries=0,
                )
            )
        )

        created_job = self.client.create_job(
            parent=f"projects/{self.project_id}/locations/{self.region}",
            job=job,
            job_id=job_name,
        )

        return created_job

    def run_job(self, job_name: str):
        request = RunJobRequest(
            name=f"projects/{self.project_id}/locations/{self.region}/jobs/{job_name}"
        )

        ran_job = self.client.run_job(request=request)

        return ran_job

    def delete_job(self, job_name: str):
        request = DeleteJobRequest(
            name=f"projects/{self.project_id}/locations/{self.region}/jobs/{job_name}"
        )

        deleted_job = self.client.delete_job(request=request)

        return deleted_job
