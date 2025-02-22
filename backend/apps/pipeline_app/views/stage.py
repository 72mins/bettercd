from rest_framework import viewsets

from django.core.cache import cache

from apps.pipeline_app.models.stage import Stage
from apps.pipeline_app.permissions import IsStageOwner
from apps.pipeline_app.serializers.stage import StageSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from apps.pipeline_app.models.pipeline import Pipeline
from rest_framework.response import Response
from rest_framework import status


class StageViewSet(viewsets.ModelViewSet):
    serializer_class = StageSerializer
    permission_classes = [IsAuthenticated, IsStageOwner]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Stage.objects.filter(pipeline__user=self.request.user)

    @action(detail=True, methods=["get"])
    def pipeline_stages(self, request, pk=None):
        try:
            pipeline = Pipeline.objects.get(pk=pk, user=request.user)
            stages = Stage.objects.filter(pipeline=pipeline).order_by("order")

            serializer = self.get_serializer(stages, many=True)

            return Response(serializer.data)
        except (Pipeline.DoesNotExist, Stage.DoesNotExist, Exception):
            return Response(
                {"error": "Pipeline or Stage not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["get"])
    def script_value(self, request, pk=None):
        try:
            stage = Stage.objects.get(pk=pk, pipeline__user=request.user)

            script_content = stage.get_script_content()

            return Response({"script_value": script_content})
        except (Stage.DoesNotExist, Exception):
            return Response(
                {"error": "Stage not found"}, status=status.HTTP_404_NOT_FOUND
            )
