# Generated by Django 5.1.6 on 2025-03-04 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pipeline_app', '0009_stage_node_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stage',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
