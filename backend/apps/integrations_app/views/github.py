import os

from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
import requests

from apps.integrations_app.models.github import GithubProfile
from apps.integrations_app.serializers.github import GithubProfileSerializer


GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_CALLBACK_URL = os.getenv("GITHUB_CALLBACK_URL")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def github_auth_url(request):
    auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_CALLBACK_URL}"
        f"&scope=repo"
    )
    return Response({"auth_url": auth_url})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def github_callback(request):
    """Handle GitHub OAuth callback code"""
    code = request.data.get("code")

    # Exchange code for access token
    response = requests.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        },
        headers={"Accept": "application/json"},
    )

    token_data = response.json()
    access_token = token_data.get("access_token")

    if not access_token:
        return Response({"error": "Failed to obtain access token"}, status=400)

    # Get GitHub user data
    user_response = requests.get(
        "https://api.github.com/user",
        headers={
            "Authorization": f"token {access_token}",
            "Accept": "application/json",
        },
    )
    user_data = user_response.json()

    # Create or update GitHub profile
    github_profile, _ = GithubProfile.objects.update_or_create(
        user=request.user,
        defaults={
            "github_user_id": str(user_data["id"]),
            "github_username": user_data["login"],
            "access_token": access_token,
        },
    )

    return Response(GithubProfileSerializer(github_profile).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_repositories(request):
    """List user's GitHub repositories"""
    try:
        github_profile = request.user.githubprofile
        response = requests.get(
            "https://api.github.com/user/repos",
            headers={
                "Authorization": f"token {github_profile.access_token}",
                "Accept": "application/json",
            },
        )
        repositories = response.json()

        print(f'Repositories: {repositories}')

        res = []

        for repo in repositories:
            res.append(
                {
                    "id": repo["id"],
                    "name": repo["name"],
                    "description": repo["description"],
                    "html_url": repo["html_url"],
                }
            )

        return Response(res)
    except GithubProfile.DoesNotExist:
        return Response({"error": "GitHub account not connected"}, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_repository_content(request, owner, repo, path=""):
    """Get repository contents"""
    try:
        github_profile = request.user.githubprofile
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        response = requests.get(
            url,
            headers={
                "Authorization": f"token {github_profile.access_token}",
                "Accept": "application/json",
            },
        )
        return Response(response.json())
    except GithubProfile.DoesNotExist:
        return Response({"error": "GitHub account not connected"}, status=400)
