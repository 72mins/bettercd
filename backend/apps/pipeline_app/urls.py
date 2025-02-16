from rest_framework.routers import DefaultRouter

from apps.pipeline_app.views.pipeline import PipelineViewSet
from apps.pipeline_app.views.stage import StageViewSet

router = DefaultRouter()

router.register("ci-cd/pipeline", PipelineViewSet, basename="pipeline")
router.register("ci-cd/stage", StageViewSet, basename="stage")

urlpatterns = [
    *router.urls,
]
