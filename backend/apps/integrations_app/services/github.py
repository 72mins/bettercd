import os
import requests
import jwt
import time
from datetime import datetime
from django.utils import timezone
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


def _read_private_key(pem_path):
    if not os.path.exists(pem_path):
        raise FileNotFoundError("Private key file not found at given path.")

    try:
        with open(pem_path, "r") as pem_file:
            return pem_file.read()
    except IOError as e:
        raise IOError(f"Failed to read private key file. Error: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to read private key file. Error: {str(e)}")


class GithubClient:
    def __init__(self):
        self.app_id = os.getenv("GITHUB_APP_ID")
        self.app_name = os.getenv("GITHUB_APP_NAME")
        self.private_key = _read_private_key(os.getenv("GITHUB_PRIVATE_KEY_PATH"))
        self.callback_url = os.getenv("GITHUB_CALLBACK_URL")
        self.session = self._create_session()

    def _create_session(self):
        """Create a session with retry logic."""
        session = requests.Session()

        retry = Retry(
            total=3,
            backoff_factor=0.5,
            status_forcelist=[500, 502, 503, 504],
            allowed_methods=["GET", "POST", "DELETE"],
        )

        adapter = HTTPAdapter(max_retries=retry)

        session.mount("http://", adapter)
        session.mount("https://", adapter)

        return session

    def get_auth_url(self) -> str:
        """Auth URL is used to redirect the user to install the GitHub App"""
        return f"https://github.com/apps/{self.app_name}/installations/new"

    def generate_jwt(self):
        """Generate a JWT for GitHub App authentication"""
        now = int(time.time())
        payload = {
            "iat": now,
            "exp": now + (10 * 60),
            "iss": self.app_id,
        }

        token = jwt.encode(payload, self.private_key, algorithm="RS256")

        return token

    def get_installation_id(self, username):
        """Get the installation ID for a specific user"""
        jwt_token = self.generate_jwt()

        response = self.session.get(
            f"https://api.github.com/users/{username}/installation",
            headers={
                "Authorization": f"Bearer {jwt_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

        if response.status_code != 200:
            return None

        return response.json().get("id")

    def get_installation_token(self, installation_id):
        """Get an installation access token"""
        jwt_token = self.generate_jwt()

        response = self.session.post(
            f"https://api.github.com/app/installations/{installation_id}/access_tokens",
            headers={
                "Authorization": f"Bearer {jwt_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

        if response.status_code != 201:
            return None

        data = response.json()

        return {"token": data.get("token"), "expires_at": data.get("expires_at")}

    def ensure_valid_token(self, github_profile):
        """Ensures the GitHub profile has a valid token, refresh if necassary"""
        if github_profile.token_is_valid():
            return True, github_profile.access_token, None

        token_data = self.get_installation_token(github_profile.installation_id)

        if not token_data or not token_data.get("token"):
            return False, None, "Failed to refresh installation token"

        expires_at_naive = datetime.strptime(
            token_data["expires_at"], "%Y-%m-%dT%H:%M:%SZ"
        )
        expires_at = timezone.make_aware(expires_at_naive)

        github_profile.access_token = token_data["token"]
        github_profile.token_expires_at = expires_at
        github_profile.save()

        return True, token_data["token"], None

    def get_installation_removal_url(self, installation_id):
        """
        Get the URL for removing a GitHub App installation.
        """
        return f"https://github.com/settings/installations/{installation_id}"

    def delete_installation_server_side(self, installation_id):
        """
        Delete a GitHub App installation from the server side.
        """
        jwt_token = self.generate_jwt()

        response = self.session.delete(
            f"https://api.github.com/app/installations/{installation_id}",
            headers={
                "Authorization": f"Bearer {jwt_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

        return response.status_code == 204

    def remove_user_integration(self, github_profile):
        """
        Remove a user's GitHub integration by deleting their profile data.
        This doesn't uninstall the GitHub App from their GitHub account.
        """
        try:
            removal_url = None
            if github_profile.installation_id:
                removal_url = self.get_installation_removal_url(
                    github_profile.installation_id
                )

            github_profile.delete()

            return True, removal_url, None

        except Exception as e:
            return False, None, f"Failed to remove GitHub integration: {str(e)}"

    def get_user_data(self, installation_id=None):
        """
        Get user data for the authenticated user.
        """
        jwt_token = self.generate_jwt()

        response = self.session.get(
            f"https://api.github.com/app/installations/{installation_id}",
            headers={
                "Authorization": f"Bearer {jwt_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

        if response.status_code != 200:
            return None

        installation_data = response.json()

        account = installation_data.get("account", {})

        return {
            "id": account.get("id"),
            "login": account.get("login"),
            "avatar_url": account.get("avatar_url"),
            "html_url": account.get("html_url"),
            "type": account.get("type"),
        }

    def get_user_repos(self, access_token):
        """Get repositories accessible to the installation"""
        response = self.session.get(
            "https://api.github.com/installation/repositories",
            headers={
                "Authorization": f"token {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

        if response.status_code != 200:
            return None

        return response.json().get("repositories", [])

    def get_repo_details(self, access_token, repo_id):
        """Get repository details"""
        response = self.session.get(
            f"https://api.github.com/repositories/{repo_id}",
            headers={
                "Authorization": f"token {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

        if response.status_code != 200:
            return None

        return response.json()

    def get_repo_branches(self, access_token, repo_id):
        """Get repository branches"""
        response = self.session.get(
            f"https://api.github.com/repositories/{repo_id}/branches",
            headers={
                "Authorization": f"token {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

        if response.status_code != 200:
            return None

        return response.json()

