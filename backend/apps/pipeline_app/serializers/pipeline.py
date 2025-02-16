from rest_framework import serializers

from apps.pipeline_app.models.pipeline import Pipeline


class PipelineSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Pipeline
        fields = ["id", "name", "description", "user"]
