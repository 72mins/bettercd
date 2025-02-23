from django.db import models

from apps.base_app.models import CustomUser


class GithubProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    github_user_id = models.CharField(max_length=100)
    github_username = models.CharField(max_length=100)
    access_token = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.email}'s GitHub Profile"
