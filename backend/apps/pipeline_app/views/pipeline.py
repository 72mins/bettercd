from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from apps.base_app.pagination import ClassicPagination
from apps.base_app.permissions import IsOwner
from apps.pipeline_app.models.pipeline import Pipeline
from apps.pipeline_app.models.stage import Stage
from apps.pipeline_app.permissions import IsPipelineOwner
from apps.pipeline_app.serializers.pipeline import (
    MassPipelineSaveSerializer,
    PipelineSerializer,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser


class PipelineViewSet(viewsets.ModelViewSet):
    serializer_class = PipelineSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [FormParser, MultiPartParser]
    pagination_class = ClassicPagination

    def get_queryset(self):
        return Pipeline.objects.filter(user=self.request.user)


class MassPipelineSave(generics.GenericAPIView):
    serializer_class = MassPipelineSaveSerializer
    permission_classes = [IsAuthenticated, IsPipelineOwner]

    def get_object(self):
        """Get the pipeline object based on the URL parameter."""
        pipeline_id = self.kwargs.get("pk")

        pipeline = get_object_or_404(Pipeline, id=pipeline_id)

        return pipeline

    def patch(self, request, *args, **kwargs):
        """Handle PATCH requests to update multiple stages."""
        pipeline = self.get_object()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        stages_data = serializer.validated_data["params"]
        updated_stages = []
        errors = []

        for stage_data in stages_data:
            stage_id = stage_data["stage_id"]
            params_to_update = stage_data["params"]

            try:
                stage = get_object_or_404(Stage, id=stage_id, pipeline=pipeline)

                if stage.params is None:
                    stage.params = params_to_update

                else:
                    # If stage.params is already a dict, update it with new values
                    current_params = (
                        stage.params.copy() if isinstance(stage.params, dict) else {}
                    )

                    current_params.update(params_to_update)
                    stage.params = current_params

                stage.save()
                updated_stages.append(stage_id)
            except Exception as e:
                errors.append({"stage_id": stage_id, "error": str(e)})

        return Response(
            {"updated_stages": updated_stages, "errors": errors, "updated_count": len(updated_stages)},
            status=status.HTTP_200_OK,
        )
