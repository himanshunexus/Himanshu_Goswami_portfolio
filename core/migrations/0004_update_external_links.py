from django.db import migrations


def update_project_links(apps, schema_editor):
    Project = apps.get_model("core", "Project")

    Project.objects.filter(title="BAZAR").update(
        live_link="https://bazar-uyhy.onrender.com",
        github_link="",
    )
    Project.objects.filter(title="NIVORA").update(
        live_link="https://nivora-erp.onrender.com",
        github_link="",
    )


def revert_project_links(apps, schema_editor):
    Project = apps.get_model("core", "Project")

    Project.objects.filter(title="BAZAR").update(
        live_link="https://example.com/bazar",
        github_link="https://github.com/example/bazar",
    )
    Project.objects.filter(title="NIVORA").update(
        live_link="https://example.com/nivora",
        github_link="https://github.com/example/nivora",
    )


class Migration(migrations.Migration):
    dependencies = [("core", "0003_refresh_portfolio_projects")]

    operations = [migrations.RunPython(update_project_links, revert_project_links)]
