from django.db import models

from apps.pipeline_app.models.pipeline import Pipeline

STAGE_TYPE = (
    ("CUSTOM", "Custom"),
    ("DEPLOY", "Deploy"),
)


class Stage(models.Model):
    pipeline = models.ForeignKey(Pipeline, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.IntegerField()
    stage_type = models.CharField(max_length=10, choices=STAGE_TYPE, default="CUSTOM")

    def __str__(self):
        return f"# {self.order} {self.name} - {self.pipeline}"

    class Meta:
        indexes = [models.Index(fields=["pipeline", "order"])]
