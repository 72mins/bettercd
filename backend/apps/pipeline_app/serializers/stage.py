from apps.pipeline_app.models.stage import Stage

from rest_framework import serializers


class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = "__all__"
