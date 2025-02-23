import os
import requests


class GithubClient:
    def __init__(self):
        self.client_id = os.getenv("GITHUB_CLIENT_ID")
        self.client_secret = os.getenv("GITHUB_CLIENT_SECRET")
        self.callback_url = os.getenv("GITHUB_CALLBACK_URL")

    def get_auth_url(self) -> str:
        auth_url = (
            f"https://github.com/login/oauth/authorize"
            f"?client_id={self.client_id}"
            f"&redirect_uri={self.callback_url}"
            f"&scope=repo"
        )

        return auth_url

    def get_access_token(self, code: str) -> str:
        response = requests.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )

        token_data = response.json()
        access_token = token_data.get("access_token")

        return access_token

    def get_user_data(self, access_token: str):
        response = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"token {access_token}",
                "Accept": "application/json",
            },
        )

        user_data = response.json()

        return user_data
