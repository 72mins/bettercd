from django.urls import path

from apps.docker_app.views.runs import RunPipelineView


urlpatterns = [
    path("docker/run-pipeline/", RunPipelineView.as_view(), name="run-pipeline"),
]
