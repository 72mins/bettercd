# Generated by Django 5.1.6 on 2025-03-04 20:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pipeline_app', '0011_alter_stage_node_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stage',
            name='node_type',
            field=models.CharField(choices=[('CUSTOM', 'CUSTOM'), ('GITHUB', 'GITHUB'), ('GITLAB', 'GITLAB')], default='CUSTOM', max_length=50),
        ),
    ]
