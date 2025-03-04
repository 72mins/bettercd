from django.db import models
from django.core.cache import cache
from rest_framework.exceptions import ValidationError

from apps.pipeline_app.models.pipeline import Pipeline

INITIAL_VALUE = "#!/bin/bash\n\n# Write your bash script here...\n\n"

NODE_TYPE_CHOICES = (
    ("CUSTOM", "CUSTOM"),
    ("GITHUB", "GITHUB"),
    ("GITLAB", "GITLAB"),
)


class Stage(models.Model):
    pipeline = models.ForeignKey(Pipeline, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    order = models.IntegerField(blank=True, null=True)
    node_type = models.CharField(
        max_length=50, choices=NODE_TYPE_CHOICES, default="CUSTOM"
    )
    script = models.FileField(null=True, blank=True)

    def __str__(self):
        return f"# {self.order} {self.name} - {self.pipeline}"

    class Meta:
        indexes = [models.Index(fields=["pipeline", "order"])]

    def clean(self):
        if self.node_type == "CUSTOM" and not self.name:
            raise ValidationError("Name is required for custom functions")

        if self.node_type in ["GITHUB", "GITLAB"]:
            vcs_stages = Stage.objects.filter(
                pipeline=self.pipeline, node_type__in=["GITHUB", "GITLAB"]
            ).exclude(pk=self.pk)

            if vcs_stages.exists():
                raise ValidationError("There can only be one VCS stage per pipeline")

        return super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()

        if not self.order:
            if self.node_type in ["GITHUB", "GITLAB"]:
                self.order = 0
            else:
                last_stage = (
                    Stage.objects.filter(pipeline=self.pipeline)
                    .order_by("-order")
                    .first()
                )

                self.order = last_stage.order + 1 if last_stage.order else 1

        return super().save(*args, **kwargs)

    def get_script_content(self):
        cache_key = f"script_value_{self.pk}"
        cached_value = cache.get(cache_key)

        if cached_value is not None:
            return cached_value

        if not self.script:
            return INITIAL_VALUE

        try:
            script_content = self.script.read().decode("utf-8")
            cache.set(cache_key, script_content, timeout=3600)

            return script_content
        except (AttributeError, UnicodeDecodeError, IOError):
            return ""
