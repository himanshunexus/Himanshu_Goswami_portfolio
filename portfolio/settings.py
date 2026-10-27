"""Database-free compatibility host for the existing Render Python service.

The preferred deployment is the Render Static Site defined in render.yaml.
This host also lets the existing gunicorn portfolio.wsgi:application command work.
"""
from pathlib import Path
import os
from django.core.management.utils import get_random_secret_key

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY') or get_random_secret_key()
DEBUG = False
ALLOWED_HOSTS = [host.strip() for host in os.environ.get('ALLOWED_HOSTS', 'himanshu-goswami.onrender.com,localhost,127.0.0.1').split(',')]
if os.environ.get('RENDER_EXTERNAL_HOSTNAME'):
    ALLOWED_HOSTS.append(os.environ['RENDER_EXTERNAL_HOSTNAME'])
INSTALLED_APPS = []
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'portfolio.security.PortfolioSecurityHeaders',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
ROOT_URLCONF = 'portfolio.urls'
WSGI_APPLICATION = 'portfolio.wsgi.application'
DATABASES = {}
WHITENOISE_ROOT = BASE_DIR / 'dist'
WHITENOISE_INDEX_FILE = False
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = os.environ.get('RENDER') == 'true'
SECURE_HSTS_SECONDS = 31536000
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
