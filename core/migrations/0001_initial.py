from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("tech_stack", models.CharField(max_length=300)),
                ("github_link", models.URLField(blank=True)),
                ("live_link", models.URLField(blank=True)),
            ],
            options={"ordering": ("id",)},
        ),
    ]
