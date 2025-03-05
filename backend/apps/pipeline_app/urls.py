from rest_framework.routers import DefaultRouter
from django.urls import path

from apps.pipeline_app.views.pipeline import MassPipelineSave, PipelineViewSet
from apps.pipeline_app.views.stage import StageViewSet
from apps.pipeline_app.views.variables import EnvironmentVariableViewSet

router = DefaultRouter()

router.register("ci-cd/pipeline", PipelineViewSet, basename="pipeline")
router.register("ci-cd/stage", StageViewSet, basename="stage")
router.register(
    "environment/variables", EnvironmentVariableViewSet, basename="variables"
)

urlpatterns = [
    *router.urls,
    path(
        "ci-cd/pipeline/mass-save/<int:pk>/",
        MassPipelineSave.as_view(),
        name="mass-save-pipeline",
    ),
]
