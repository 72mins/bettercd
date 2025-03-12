# Generated by Django 5.1.6 on 2025-03-11 21:29

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="GithubProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("github_user_id", models.CharField(max_length=100)),
                ("github_username", models.CharField(max_length=100)),
                (
                    "installation_id",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                (
                    "access_token",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("token_expires_at", models.DateTimeField(blank=True, null=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
