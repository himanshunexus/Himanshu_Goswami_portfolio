from django.db import migrations


def refresh_projects(apps, schema_editor):
    Project = apps.get_model("core", "Project")

    Project.objects.all().delete()

    Project.objects.bulk_create(
        [
            Project(
                title="BAZAR",
                description=(
                    "A commerce-focused Django platform built to manage listings, structured data, "
                    "and operational workflows with a clean backend foundation. Celery handles the "
                    "asynchronous work so the product remains responsive under real usage."
                ),
                tech_stack="DJANGO | POSTGRESQL | TAILWIND | CELERY",
                github_link="https://github.com/example/bazar",
                live_link="https://example.com/bazar",
            ),
            Project(
                title="NIVORA",
                description=(
                    "A backend-heavy product experience designed around reliable task execution, "
                    "data persistence, and a restrained user interface. It combines Django, Celery, "
                    "and JavaScript to support practical day-to-day workflows."
                ),
                tech_stack="DJANGO | CELERY | POSTGRESQL | JAVASCRIPT",
                github_link="https://github.com/example/nivora",
                live_link="https://example.com/nivora",
            ),
        ]
    )


def restore_previous_projects(apps, schema_editor):
    Project = apps.get_model("core", "Project")

    Project.objects.all().delete()

    Project.objects.bulk_create(
        [
            Project(
                title="TOKYO SYSTEMS API",
                description=(
                    "A production-minded API platform built with Django and Django REST Framework. "
                    "It includes token-based auth, audit-friendly architecture, and a clean admin workflow."
                ),
                tech_stack="Django | DRF | PostgreSQL | Tailwind",
                github_link="https://github.com/example/tokyo-systems-api",
                live_link="https://example.com/tokyo-systems-api",
            ),
            Project(
                title="SIGNAL PIPELINE",
                description=(
                    "A data processing service for scheduled ingestion, enrichment, and delivery. "
                    "The system focuses on resilient task orchestration and clear operational visibility."
                ),
                tech_stack="Python | Celery | Redis | PostgreSQL",
                github_link="https://github.com/example/signal-pipeline",
                live_link="https://example.com/signal-pipeline",
            ),
            Project(
                title="MONO AUTH",
                description=(
                    "A focused authentication product with email login, permissions, and JWT issuance. "
                    "The interface stays intentionally spare while the backend handles the heavy lifting."
                ),
                tech_stack="Django | JWT | SQLite | JavaScript",
                github_link="https://github.com/example/mono-auth",
                live_link="https://example.com/mono-auth",
            ),
        ]
    )


class Migration(migrations.Migration):
    dependencies = [("core", "0002_seed_projects")]

    operations = [migrations.RunPython(refresh_projects, restore_previous_projects)]
