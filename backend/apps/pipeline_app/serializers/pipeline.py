from rest_framework import serializers

from apps.pipeline_app.models.pipeline import Pipeline


class PipelineSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Pipeline
        fields = ["id", "name", "description", "user"]


class MassPipelineSaveSerializer(serializers.Serializer):
    params = serializers.JSONField()

    def validate_params(self, value):
        """Validate that params is a list of objects with required fields"""

        if not isinstance(value, list):
            raise serializers.ValidationError("Params must be a list")

        for item in value:
            if not isinstance(item, dict):
                raise serializers.ValidationError(
                    "Each item in params must be an object"
                )

            if "stage_id" not in item:
                raise serializers.ValidationError("Each item must have a stage_id")

            if "params" not in item or not isinstance(item["params"], dict):
                raise serializers.ValidationError("Each item must have a params object")

        return value
