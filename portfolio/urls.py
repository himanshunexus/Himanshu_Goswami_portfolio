"""Public portfolio only; no admin, accounts, sessions, or database routes."""
from django.urls import include, path

urlpatterns = [path('', include('core.urls'))]
