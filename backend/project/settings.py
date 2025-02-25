from dotenv import load_dotenv
from pathlib import Path
import os
from datetime import timedelta

# Load environment variables from .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG") == "True"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS").split(",")
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS").split(",")

PASSWORD_RESET_TIMEOUT = 7200

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "drf_spectacular",
    "django_env_validator",
    # Local
    "apps.base_app",
    "apps.pipeline_app",
    "apps.docker_app",
    "apps.integrations_app",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "crum.CurrentRequestUserMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "project.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": "localhost",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

SPECTACULAR_SETTINGS = {
    "TITLE": "BetterCD API",
    "DESCRIPTION": "No-Code graphical CI/CD pipeline builder",
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "PUBLIC_DOCS": True,
    "COMPONENT_SPLIT_REQUEST": True,
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "displayOperationId": True,
        "persistAuthorization": True,
        "displayRequestDuration": True,
        "tryItOutEnabled": True,
    },
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

STORAGES = {
    "default": {
        "BACKEND": "apps.base_app.storage.UserMediaStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

AWS_ACCESS_KEY_ID = os.getenv("CLOUDFLARE_R2_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.getenv("CLOUDFLARE_R2_SECRET_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("CLOUDFLARE_R2_BUCKET_NAME")
AWS_S3_ENDPOINT_URL = os.getenv("CLOUDFLARE_R2_ENDPOINT_URL")
AWS_S3_SIGNATURE_VERSION = "s3v4"

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "ROTATE_REFRESH_TOKENS": False,
}

ENV_VALIDATOR_RULES = {
    "DB_NAME": {"required": True},
    "DB_USER": {"required": True},
    "DB_PASSWORD": {"required": True},
    "CLOUDFLARE_R2_ACCESS_KEY": {"required": True},
    "CLOUDFLARE_R2_SECRET_KEY": {"required": True},
    "CLOUDFLARE_R2_ENDPOINT_URL": {"required": True},
    "CLOUDFLARE_R2_BUCKET_NAME": {"required": True},
    "GCLOUD_PROJECT_ID": {"required": True},
    "GCLOUD_LOG_SUBSCRIPTION_ID": {"required": True},
    "GCLOUD_REGION": {"required": True},
    "GITHUB_CLIENT_ID": {"required": True},
    "GITHUB_CLIENT_SECRET": {"required": True},
    "GITHUB_CALLBACK_URL": {"required": True},
}

AUTH_USER_MODEL = "base_app.CustomUser"

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
