from rest_framework.routers import DefaultRouter

from apps.pipeline_app.views.pipeline import PipelineViewSet

router = DefaultRouter()

router.register("pipeline", PipelineViewSet, basename="pipeline")

urlpatterns = [
    *router.urls,
]
