from django.db import models

from apps.base_app.models import CustomUser


class Pipeline(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.name}"

    class Meta:
        indexes = [models.Index(fields=["user"])]
