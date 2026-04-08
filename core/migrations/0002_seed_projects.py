from django.db import migrations


def seed_projects(apps, schema_editor):
    Project = apps.get_model("core", "Project")

    projects = [
        {
            "title": "TOKYO SYSTEMS API",
            "description": (
                "A production-minded API platform built with Django and Django REST Framework. "
                "It includes token-based auth, audit-friendly architecture, and a clean admin workflow."
            ),
            "tech_stack": "Django | DRF | PostgreSQL | Tailwind",
            "github_link": "https://github.com/example/tokyo-systems-api",
            "live_link": "https://example.com/tokyo-systems-api",
        },
        {
            "title": "SIGNAL PIPELINE",
            "description": (
                "A data processing service for scheduled ingestion, enrichment, and delivery. "
                "The system focuses on resilient task orchestration and clear operational visibility."
            ),
            "tech_stack": "Python | Celery | Redis | PostgreSQL",
            "github_link": "https://github.com/example/signal-pipeline",
            "live_link": "https://example.com/signal-pipeline",
        },
        {
            "title": "MONO AUTH",
            "description": (
                "A focused authentication product with email login, permissions, and JWT issuance. "
                "The interface stays intentionally spare while the backend handles the heavy lifting."
            ),
            "tech_stack": "Django | JWT | SQLite | JavaScript",
            "github_link": "https://github.com/example/mono-auth",
            "live_link": "https://example.com/mono-auth",
        },
    ]

    for project in projects:
        Project.objects.create(**project)


def unseed_projects(apps, schema_editor):
    Project = apps.get_model("core", "Project")
    Project.objects.filter(
        title__in=["TOKYO SYSTEMS API", "SIGNAL PIPELINE", "MONO AUTH"]
    ).delete()


class Migration(migrations.Migration):
    dependencies = [("core", "0001_initial")]

    operations = [migrations.RunPython(seed_projects, unseed_projects)]
