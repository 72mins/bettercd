from rest_framework import viewsets

from apps.pipeline_app.models.stage import Stage
from apps.pipeline_app.permissions import IsStageOwner
from apps.pipeline_app.serializers.stage import StageSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated


class StageViewSet(viewsets.ModelViewSet):
    serializer_class = StageSerializer
    permission_classes = [IsAuthenticated, IsStageOwner]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Stage.objects.filter(pipeline__user=self.request.user)
