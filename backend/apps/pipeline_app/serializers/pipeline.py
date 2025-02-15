from rest_framework import serializers

from apps.pipeline_app.models.pipeline import Pipeline


class PipelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pipeline
        fields = "__all__"
