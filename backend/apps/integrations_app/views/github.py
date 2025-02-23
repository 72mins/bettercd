from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.integrations_app.models.github import GithubProfile
from apps.integrations_app.serializers.github import GithubProfileSerializer
from apps.integrations_app.services.github import GithubClient


class GithubAuthURL(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        github_client = GithubClient()

        return Response(
            {"auth_url": github_client.get_auth_url()}, status=status.HTTP_200_OK
        )


class GithubCallback(generics.GenericAPIView):
    serializer_class = GithubProfileSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get("code", None)

        github_client = GithubClient()

        if not code:
            return Response(
                {"error": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        access_token = github_client.get_access_token(code)

        if not access_token:
            return Response(
                {"error": "Failed to obtain access token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_data = github_client.get_user_data(access_token)

        github_profile, _ = GithubProfile.objects.update_or_create(
            user=request.user,
            defaults={
                "github_user_id": str(user_data["id"]),
                "github_username": user_data["login"],
                "access_token": access_token,
            },
        )

        serializer = self.serializer_class(github_profile)

        return Response(serializer.data, status=status.HTTP_200_OK)
