from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from django.urls import path, include

from apps.base_app import urls as base_app_urls
from apps.pipeline_app import urls as pipeline_app_urls
from apps.docker_app import urls as docker_app_urls
from apps.integrations_app import urls as integrations_app_urls

from apps.base_app.views.login import CustomRefreshView, CustomTokenPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    # Apps
    path("", include(base_app_urls)),
    path("", include(pipeline_app_urls)),
    path("", include(docker_app_urls)),
    path("", include(integrations_app_urls)),
    # Auth
    path("api/token/refresh/", CustomRefreshView.as_view(), name="token_refresh"),
    path("api/token/", CustomTokenPairView.as_view(), name="my_token_obtain_pair"),
    # Swagger
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
