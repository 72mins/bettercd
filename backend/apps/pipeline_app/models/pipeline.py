from django.db import models
import os

from rest_framework.exceptions import ValidationError

from apps.base_app.models import CustomUser

from apps.pipeline_app.tasks.run_pipeline import async_run_pipeline
from django_celery_results.models import TaskResult

SUBSCRIPTION_ID = os.environ.get("GCLOUD_LOG_SUBSCRIPTION_ID")


class Pipeline(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.name}"

    class Meta:
        indexes = [models.Index(fields=["user"])]

    @property
    def running_status(self):
        target = (
            "\"{'github_profile_id': "
            + str(self.user.githubprofile.id)
            + ", 'pipeline_id': "
            + str(self.id)
            + '}"'
        )

        task = TaskResult.objects.filter(task_kwargs=target).first()

        if task:
            return task.status

    def run_pipeline(self):
        if self.running_status in ["PENDING", "STARTED"]:
            raise ValidationError({"error": "Pipeline is already running"})

        async_run_pipeline.delay(
            github_profile_id=self.user.githubprofile.id, pipeline_id=self.id
        )
