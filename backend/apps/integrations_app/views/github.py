from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime

from apps.integrations_app.models.github import GithubProfile
from apps.integrations_app.serializers.github import GithubProfileSerializer
from apps.integrations_app.services.github import GithubClient


class GithubAuthURL(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        github_client = GithubClient()

        auth_url = github_client.get_auth_url()

        return Response({"auth_url": auth_url}, status=status.HTTP_200_OK)


class GithubCallback(generics.GenericAPIView):
    serializer_class = GithubProfileSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        installation_id = request.data.get("installation_id")

        if not installation_id:
            return Response(
                {"error": "Installation ID not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        github_client = GithubClient()

        token_data = github_client.get_installation_token(installation_id)

        if not token_data or not token_data.get("token"):
            return Response(
                {"error": "Failed to obtain installation token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_data = github_client.get_user_data(installation_id=installation_id)

        if not user_data or not user_data.get("id"):
            return Response(
                {"error": "Failed to get user data"}, status=status.HTTP_400_BAD_REQUEST
            )

        expires_at = datetime.strptime(token_data["expires_at"], "%Y-%m-%dT%H:%M:%SZ")

        github_profile, _ = GithubProfile.objects.update_or_create(
            user=request.user,
            defaults={
                "github_user_id": str(user_data["id"]),
                "github_username": user_data["login"],
                "installation_id": installation_id,
                "access_token": token_data["token"],
                "token_expires_at": expires_at,
            },
        )

        serializer = self.serializer_class(github_profile)

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRepositories(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            github_profile = GithubProfile.objects.get(user=request.user)
            github_client = GithubClient()

            success, token, error = github_client.ensure_valid_token(github_profile)

            if not success:
                return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

            user_repos = github_client.get_user_repos(token)

            if user_repos is None:
                return Response(
                    {"error": "Failed to fetch repositories"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            response = []
            for repo in user_repos:
                response.append(
                    {
                        "id": repo["id"],
                        "name": repo["name"],
                        "full_name": repo["full_name"],
                        "clone_url": repo["clone_url"],
                        "default_branch": repo["default_branch"],
                    }
                )

            return Response(response, status=status.HTTP_200_OK)

        except GithubProfile.DoesNotExist:
            return Response(
                {"error": "Github profile not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GithubProfileView(generics.GenericAPIView):
    serializer_class = GithubProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            github_profile = GithubProfile.objects.get(user=request.user)
            serializer = self.serializer_class(github_profile)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except GithubProfile.DoesNotExist:
            return Response({}, status=status.HTTP_200_OK)


class RemoveGithubIntegration(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        github_client = GithubClient()

        try:
            github_profile = GithubProfile.objects.get(user=request.user)

            success, removal_url, error = github_client.remove_user_integration(
                github_profile
            )

            if not success:
                return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

            response_data = {
                "message": "GitHub integration removed successfully",
                "github_app_removal_url": removal_url,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except GithubProfile.DoesNotExist:
            return Response(
                {"error": "GitHub profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

