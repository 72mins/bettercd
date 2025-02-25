from rest_framework import serializers

from apps.pipeline_app.models.variables import EnvironmentVariable


class EnvironmentVariableSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentVariable
        fields = "__all__"
