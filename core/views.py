from django.shortcuts import render
from django.db.utils import OperationalError, ProgrammingError

from .models import Project


DEFAULT_PROJECTS = [
    {
        "title": "BAZAR",
        "description": (
            "A commerce-focused Django platform built to manage listings, structured data, "
            "and operational workflows with a clean backend foundation. Celery handles the "
            "asynchronous work so the product remains responsive under real usage."
        ),
        "tech_stack": "DJANGO | POSTGRESQL | TAILWIND | CELERY",
        "github_link": "",
        "live_link": "https://bazar-uyhy.onrender.com",
    },
    {
        "title": "NIVORA",
        "description": (
            "A backend-heavy product experience designed around reliable task execution, "
            "data persistence, and a restrained user interface. It combines Django, Celery, "
            "and JavaScript to support practical day-to-day workflows."
        ),
        "tech_stack": "DJANGO | CELERY | POSTGRESQL | JAVASCRIPT",
        "github_link": "",
        "live_link": "https://nivora-erp.onrender.com",
    },
]


def home(request):
    try:
        projects = Project.objects.all()
    except (OperationalError, ProgrammingError):
        projects = DEFAULT_PROJECTS

    return render(request, "index.html", {"projects": projects})
