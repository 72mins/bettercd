from apps.pipeline_app.models.stage import Stage

from django.core.cache import cache
from rest_framework import serializers

from django.core.files.base import ContentFile


class StageSerializer(serializers.ModelSerializer):
    script_value = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Stage
        fields = "__all__"

    def update(self, instance, validated_data):
        script_value = validated_data.pop("script_value", None)

        if script_value:
            cache.delete(f"script_value_{instance.pk}")

            # Convert line endings to Unix style
            unix_script = script_value.replace("\r\n", "\n").replace("\r", "\n")

            script_name = f"script_{instance.pk}.sh"

            instance.script.save(
                script_name, ContentFile(unix_script.encode("utf-8")), save=False
            )

        return super().update(instance, validated_data)
