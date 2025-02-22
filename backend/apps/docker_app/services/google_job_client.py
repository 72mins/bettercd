import os

from google.cloud import run_v2
from google.cloud.run_v2 import RunJobRequest, DeleteJobRequest

from apps.docker_app.utils.google_credentials import get_google_credentials

GCLOUD_ID = os.environ.get("GCLOUD_PROJECT_ID")
GCLOUD_REGION = os.environ.get("GCLOUD_REGION")


class GoogleJobsClient:
    def __init__(self):
        storage_credentials = get_google_credentials()

        self.client = run_v2.JobsClient(credentials=storage_credentials)

    def create_job(self, job, job_name: str):
        created_job = self.client.create_job(
            parent=f"projects/{GCLOUD_ID}/locations/{GCLOUD_REGION}",
            job=job,
            job_id=job_name,
        )

        return created_job

    def run_job(self, job_name: str):
        request = RunJobRequest(
            name=f"projects/{GCLOUD_ID}/locations/{GCLOUD_REGION}/jobs/{job_name}"
        )

        ran_job = self.client.run_job(request=request)

        return ran_job

    def delete_job(self, job_name: str):
        request = DeleteJobRequest(
            name=f"projects/{GCLOUD_ID}/locations/{GCLOUD_REGION}/jobs/{job_name}"
        )

        deleted_job = self.client.delete_job(request=request)

        return deleted_job
