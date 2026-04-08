from unittest.mock import patch

from django.db.utils import OperationalError
from django.test import TestCase
from django.test.utils import override_settings
from django.urls import reverse

from .models import Project


@override_settings(SECURE_SSL_REDIRECT=False)
class HomeViewTests(TestCase):
    def test_home_page_renders_projects(self) -> None:
        project = Project.objects.create(
            title="Minimal API Platform",
            description="A compact project fixture for template coverage.",
            tech_stack="Django | PostgreSQL | Tailwind",
            github_link="https://github.com/example/minimal-api-platform",
            live_link="https://example.com/minimal-api-platform",
        )

        response = self.client.get(reverse("core:home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "HIMANSHU")
        self.assertContains(response, project.title)

    def test_home_page_falls_back_when_project_table_is_unavailable(self) -> None:
        with patch("core.views.Project.objects.all", side_effect=OperationalError("db unavailable")):
            response = self.client.get(reverse("core:home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "BAZAR")
        self.assertContains(response, "NIVORA")
