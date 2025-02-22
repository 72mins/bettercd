import time

from google.cloud import logging_v2

from apps.docker_app.utils.google_credentials import get_google_credentials


def _stream_job_logs(logging_client, log_filter):
    seen_entries = set()

    while True:
        entries = logging_client.list_entries(filter_=log_filter)

        for entry in entries:
            if entry.insert_id not in seen_entries:
                seen_entries.add(entry.insert_id)

                yield entry

        time.sleep(1)


class GoogleLogsClient:
    def __init__(self):
        storage_credentials = get_google_credentials()

        self.client = logging_v2.Client(credentials=storage_credentials)

    def stream_job_logs(self, log_filter):
        for entry in _stream_job_logs(
            logging_client=self.client, log_filter=log_filter
        ):
            if "Job completed" in entry.payload:
                break

            timestamp = entry.timestamp.isoformat()

            print("* {}: {}".format(timestamp, entry.payload))
