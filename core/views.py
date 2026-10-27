"""Serve the compiled React application without models or database access."""
from pathlib import Path
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.http import require_safe


@require_safe
def home(request):
    index = Path(settings.BASE_DIR) / 'dist' / 'index.html'
    if not index.is_file():
        return HttpResponse('Build the portfolio first with npm ci && npm run build.', status=503)
    return HttpResponse(index.read_text(encoding='utf-8'), content_type='text/html')
