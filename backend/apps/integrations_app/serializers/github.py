from rest_framework import serializers

from apps.integrations_app.models.github import GithubProfile


class GithubProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GithubProfile
        exclude = ["access_token", "token_expires_at", "installation_id"]
