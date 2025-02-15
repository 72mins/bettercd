from rest_framework import viewsets

from apps.base_app.pagination import ClassicPagination
from apps.base_app.permissions import IsOwner
from apps.pipeline_app.models.pipeline import Pipeline
from apps.pipeline_app.serializers.pipeline import PipelineSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser


class PipelineViewSet(viewsets.ModelViewSet):
    serializer_class = PipelineSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [FormParser, MultiPartParser]
    pagination_class = ClassicPagination

    def get_queryset(self):
        return Pipeline.objects.filter(user=self.request.user)
