from django.db import models

from apps.pipeline_app.models import Pipeline


class EnvironmentVariable(models.Model):
    pipeline = models.ForeignKey(Pipeline, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.pipeline.name}"

    class Meta:
        indexes = [models.Index(fields=["pipeline"])]
