from rest_framework import viewsets

from apps.pipeline_app.models.stage import Stage
from apps.pipeline_app.permissions import IsPipelineOwner
from apps.pipeline_app.serializers.stage import StageSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from apps.pipeline_app.models.pipeline import Pipeline
from rest_framework.response import Response
from rest_framework import status


class StageViewSet(viewsets.ModelViewSet):
    serializer_class = StageSerializer
    permission_classes = [IsAuthenticated, IsPipelineOwner]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Stage.objects.filter(pipeline__user=self.request.user).order_by("order")

    @action(detail=True, methods=["get"])
    def pipeline_stages(self, request, pk=None):
        try:
            pipeline = Pipeline.objects.get(pk=pk, user=request.user)
            stages = pipeline.stage_set.all().order_by("order")

            serializer = self.get_serializer(stages, many=True)

            last_order = stages.last().order if stages else 0

            return Response({"stages": serializer.data, "last_order": last_order})
        except Pipeline.DoesNotExist:
            return Response(
                {"error": "Pipeline not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": f"Error retrieving stages: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def script_value(self, request, pk=None):
        try:
            stage = Stage.objects.select_related("pipeline").get(
                pk=pk, pipeline__user=request.user
            )

            script_content = stage.get_script_content()

            return Response({"script_value": script_content})
        except Stage.DoesNotExist:
            return Response(
                {"error": "Stage not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error retrieving script content: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
