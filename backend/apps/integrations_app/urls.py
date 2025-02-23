from django.urls import path

from apps.integrations_app.views.github import (
    get_repository_content,
    github_auth_url,
    github_callback,
    list_repositories,
)

urlpatterns = [
    path("github/auth-url/", github_auth_url, name="github_auth_url"),
    path("github/callback/", github_callback, name="github_callback"),
    path("github/repositories/", list_repositories, name="list_repositories"),
    path(
        "github/repos/<str:owner>/<str:repo>/contents/<path:path>",
        get_repository_content,
        name="get_repository_content",
    ),
]
