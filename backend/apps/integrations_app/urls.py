from django.urls import path

from apps.integrations_app.views.github import (
    GithubAuthURL,
    GithubCallback,
    GithubProfileView,
    RemoveGithubIntegration,
    UserRepositories,
)


urlpatterns = [
    path("github/auth-url/", GithubAuthURL.as_view(), name="github_auth_url"),
    path("github/callback/", GithubCallback.as_view(), name="github_callback"),
    path(
        "github/remove-integration/",
        RemoveGithubIntegration.as_view(),
        name="remove_github_integration",
    ),
    path("github/repositories/", UserRepositories.as_view(), name="user_repositories"),
    path("github/profile/", GithubProfileView.as_view(), name="github_profile"),
]
