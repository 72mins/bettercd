from django.db import models
from django.core.cache import cache

from apps.pipeline_app.models.pipeline import Pipeline

STAGE_TYPE = (
    ("CUSTOM", "Custom"),
    ("DEPLOY", "Deploy"),
)


class Stage(models.Model):
    pipeline = models.ForeignKey(Pipeline, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, null=True, blank=True)
    order = models.IntegerField()
    stage_type = models.CharField(max_length=10, choices=STAGE_TYPE, default="CUSTOM")
    script = models.FileField(null=True, blank=True)

    def __str__(self):
        return f"# {self.order} {self.name} - {self.pipeline}"

    class Meta:
        indexes = [models.Index(fields=["pipeline", "order"])]

    def get_script_content(self):
        cache_key = f"script_value_{self.pk}"
        cached_value = cache.get(cache_key)

        if cached_value:
            return cached_value

        script_content = self.script.read().decode("utf-8")
        cache.set(cache_key, script_content, timeout=3600)

        return script_content
