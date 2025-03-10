from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser

from apps.pipeline_app.models.variables import EnvironmentVariable
from apps.pipeline_app.permissions import IsPipelineOwner
from apps.pipeline_app.serializers.variables import EnvironmentVariableSerializer


class EnvironmentVariableViewSet(viewsets.ModelViewSet):
    serializer_class = EnvironmentVariableSerializer
    permission_classes = [IsAuthenticated, IsPipelineOwner]
    parser_classes = [FormParser, MultiPartParser]

    def get_queryset(self):
        return EnvironmentVariable.objects.filter(pipeline__user=self.request.user)
