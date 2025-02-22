import os
import json

from google.oauth2 import service_account


def get_google_credentials():
    if not os.path.exists("service-account.json"):
        raise Exception("Service account file not found")

    with open("service-account.json", "r") as f:
        info = json.load(f)

    return service_account.Credentials.from_service_account_info(info)
