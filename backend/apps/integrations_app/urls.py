from django.urls import path

from apps.integrations_app.views.github import GithubAuthURL, GithubCallback


urlpatterns = [
    path("github/auth-url/", GithubAuthURL.as_view(), name="github_auth_url"),
    path("github/callback/", GithubCallback.as_view(), name="github_callback"),
]
