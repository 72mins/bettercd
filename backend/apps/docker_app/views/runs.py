from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

import os
from django.db import transaction

from apps.docker_app.serializers.runs import RunPipelineSerializer
from apps.base_app.permissions import IsOwner
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from apps.docker_app.services.google_job_client import GoogleJobsClient
from apps.docker_app.services.google_log_client import GoogleLogsClient
from apps.pipeline_app.models.stage import Stage

from apps.pipeline_app.models.pipeline import Pipeline

from google.cloud.run_v2 import (
    Job,
    Container,
    ResourceRequirements,
    ExecutionTemplate,
    TaskTemplate,
    EnvVar,
)

GCLOUD_ID = os.environ.get("GCLOUD_PROJECT_ID")
GCLOUD_REGION = os.environ.get("GCLOUD_REGION")

BASE_IMAGE = f"{GCLOUD_REGION}-docker.pkg.dev/{GCLOUD_ID}/script-repo/base-image:latest"


class RunPipelineView(generics.CreateAPIView):
    serializer_class = RunPipelineSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [FormParser, MultiPartParser]

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            pipeline_id = request.data.get("pipeline_id", None)

            if not pipeline_id:
                return Response(
                    {"message": "Pipeline ID is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                pipeline = Pipeline.objects.get(id=pipeline_id)
            except Pipeline.DoesNotExist:
                return Response(
                    {"message": "Pipeline not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            first_pipeline_stage = (
                Stage.objects.filter(pipeline=pipeline).order_by("order").first()
            )

            container = Container(
                image=BASE_IMAGE,
                env=[
                    EnvVar(
                        name="SCRIPT_CONTENT",
                        value=first_pipeline_stage.get_script_content(),
                    )
                ],
                resources=ResourceRequirements(
                    limits={
                        "memory": "512Mi",
                        "cpu": "1",
                    }
                ),
            )

            job = Job(
                template=ExecutionTemplate(
                    template=TaskTemplate(
                        containers=[container],
                        timeout={"seconds": 600},
                    )
                )
            )

            job_client = GoogleJobsClient()
            log_client = GoogleLogsClient()

            job_name = "test-job-16"

            job_client.create_job(job=job, job_name=job_name)
            job_client.run_job(job_name=job_name)

            filter = f"resource.type=cloud_run_job AND resource.labels.job_name={job_name} AND severity=DEFAULT"

            log_client.stream_job_logs(log_filter=filter)

            job_client.delete_job(job_name=job_name)

            return Response(
                {"message": "Pipeline run finished."}, status=status.HTTP_200_OK
            )
