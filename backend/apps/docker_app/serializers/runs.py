from rest_framework import serializers
from apps.pipeline_app.models import Pipeline


class RunPipelineSerializer(serializers.ModelSerializer):
    pipeline_id = serializers.IntegerField()
    github_project_id = serializers.IntegerField()

    class Meta:
        model = Pipeline
        fields = ["pipeline_id", "github_project_id"]
