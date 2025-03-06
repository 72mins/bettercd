from django.db import models
from django.utils import timezone

from apps.base_app.models import CustomUser


class GithubProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    github_user_id = models.CharField(max_length=100)
    github_username = models.CharField(max_length=100)
    installation_id = models.CharField(max_length=100, null=True, blank=True)
    access_token = models.CharField(max_length=255, null=True, blank=True)
    token_expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email}'s GitHub Profile"

    def token_is_valid(self):
        if not self.token_expires_at:
            return False

        return self.token_expires_at > timezone.now()
