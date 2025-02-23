from django.db import models
import uuid
import json
import threading

from apps.base_app.models import CustomUser

from apps.docker_app.services.google_job_client import GoogleJobsClient
from apps.docker_app.utils.google_credentials import get_google_credentials
from apps.integrations_app.services.github import GithubClient

from concurrent.futures import TimeoutError
from google.cloud import pubsub_v1

project_id = "bettercd-project"
subscription_id = "log-subscription"
timeout = 30.0


class FilteredLogSubscriber:
    def __init__(self, project_id: str, subscription_id: str, credentials):
        self.project_id = project_id
        self.subscription_id = subscription_id
        self.credentials = credentials
        self.subscriber = pubsub_v1.SubscriberClient(credentials=credentials)
        self.subscription_path = self.subscriber.subscription_path(
            project_id, subscription_id
        )
        self._stop_event = threading.Event()

    def process_message(
        self,
        message,
        job_name: str,
        callback: callable,
    ) -> None:
        """Process incoming Pub/Sub message and filter by job name."""
        try:
            data = json.loads(message.data.decode("utf-8"))

            # Extract resource.labels.job_name from the log entry
            resource = data.get("resource", {})
            labels = resource.get("labels", {})
            log_job_name = labels.get("job_name", "")

            # Only process logs for the specific job
            if log_job_name == job_name:
                callback(data)

            # Acknowledge the message regardless of whether we used it
            message.ack()

        except json.JSONDecodeError:
            print(f"Failed to decode message: {message.data}")
            message.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            message.ack()

    def listen_for_logs(self, job_name: str, callback, timeout) -> None:
        """Listen for logs specific to a job name with timeout support."""

        def wrapped_callback(message):
            self.process_message(message, job_name, callback)

        streaming_pull_future = self.subscriber.subscribe(
            self.subscription_path, callback=wrapped_callback
        )

        with self.subscriber:
            try:
                # Wait for the specified timeout or until stop is called
                if timeout:
                    streaming_pull_future.result(timeout=timeout)
                else:
                    while not self._stop_event.is_set():
                        streaming_pull_future.result(timeout=1)
            except TimeoutError:
                streaming_pull_future.cancel()
                streaming_pull_future.result()
            finally:
                self._stop_event.clear()

    def stop(self) -> None:
        """Stop listening for messages."""
        self._stop_event.set()


def callback(message):
    # Decode bytes to string and parse JSON
    data = json.loads(message.data.decode("utf-8"))

    # Extract timestamp and textPayload
    timestamp = data["timestamp"]
    text_payload = data["textPayload"]

    print(f"{timestamp}: {text_payload}")

    message.ack()


class Pipeline(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.name}"

    class Meta:
        indexes = [models.Index(fields=["user"])]

    def run_pipeline(self, github_project_id):
        storage_credentials = get_google_credentials()
        job_client = GoogleJobsClient()
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

        try:
            job_client.create_job(stages, repo_details, job_name, github_profile)
            job_client.run_job(job_name)

            log_subscriber = FilteredLogSubscriber(
                project_id, subscription_id, storage_credentials
            )

            def log_callback(log_entry):
                print(
                    f'Received log for job "{job_name}": {log_entry["timestamp"]}:: {log_entry["textPayload"]}'
                )

            log_subscriber.listen_for_logs(
                job_name=job_name,
                callback=log_callback,
                timeout=timeout,
            )
        finally:
            job_client.delete_job(job_name=job_name)
