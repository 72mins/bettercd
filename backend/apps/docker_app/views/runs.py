from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.docker_app.serializers.runs import RunPipelineSerializer
from apps.base_app.permissions import IsOwner
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser

from apps.pipeline_app.models.pipeline import Pipeline


class RunPipelineView(generics.CreateAPIView):
    serializer_class = RunPipelineSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [FormParser, MultiPartParser]

    def create(self, request, *args, **kwargs):
        pipeline_id = request.data.get("pipeline_id", None)

        if not pipeline_id:
            return Response(
                {"message": "Pipeline ID and Github Project ID are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            pipeline = Pipeline.objects.get(id=pipeline_id)
        except Pipeline.DoesNotExist:
            return Response(
                {"message": "Pipeline not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        pipeline.run_pipeline()

        return Response({"message": "Pipeline run started."}, status=status.HTTP_200_OK)
