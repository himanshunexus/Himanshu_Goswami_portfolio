from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    tech_stack = models.CharField(max_length=300)
    github_link = models.URLField(blank=True)
    live_link = models.URLField(blank=True)

    class Meta:
        ordering = ("id",)

    def __str__(self) -> str:
        return self.title
