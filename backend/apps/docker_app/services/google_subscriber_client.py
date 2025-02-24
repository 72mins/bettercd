import os
import json
import threading

from concurrent.futures import TimeoutError

from google.cloud import pubsub_v1

from apps.docker_app.utils.google_credentials import get_google_credentials


def _log_callback(log_entry):
    print(f"{log_entry['timestamp']}: {log_entry['textPayload']}")


class GoogleSubscriberClient:
    def __init__(self, subscription_id: str):
        storage_credentials = get_google_credentials()
        self.client = pubsub_v1.SubscriberClient(credentials=storage_credentials)

        self.subscription_id = subscription_id
        self.project_id = os.environ.get("GCLOUD_PROJECT_ID")

        self.subscription_path = self.client.subscription_path(
            self.project_id, self.subscription_id
        )

        self._stop_event = threading.Event()

    def process_message(self, message, job_name):
        try:
            data = json.loads(message.data.decode("utf-8"))

            resource = data.get("resource", {})
            labels = resource.get("labels", {})
            log_job_name = labels.get("job_name", "")

            if log_job_name == job_name:
                _log_callback(data)

            message.ack()
        except json.JSONDecodeError:
            print(f"Failed to decode message: {message.data}")
            message.ack()
        except Exception as e:
            print(f"Error processing message: {e}")
            message.ack()

    def listen_for_logs(self, job_name, timeout=30):
        def callback_wrapper(message):
            self.process_message(message, job_name)

        streaming_pull = self.client.subscribe(
            subscription=self.subscription_path, callback=callback_wrapper
        )

        with self.client:
            try:
                streaming_pull.result(timeout=timeout)
            except TimeoutError:
                streaming_pull.cancel()
                streaming_pull.result()
            finally:
                self._stop_event.clear()

    def stop(self):
        self._stop_event.set()
