from pathlib import Path
import re
from unittest.mock import patch
from django.test import SimpleTestCase, override_settings
from django.urls import reverse


@override_settings(ALLOWED_HOSTS=['testserver'])
class PortfolioTests(SimpleTestCase):
    def test_compiled_portfolio_is_served_without_a_database(self):
        response = self.client.get(reverse('core:home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Himanshu Goswami')
        self.assertContains(response, 'id="root"')

    def test_missing_build_returns_clear_service_unavailable(self):
        with patch.object(Path, 'is_file', return_value=False):
            response = self.client.get(reverse('core:home'))
        self.assertEqual(response.status_code, 503)

    def test_admin_is_not_exposed(self):
        self.assertEqual(self.client.get('/admin/').status_code, 404)

    def test_public_portfolio_is_read_only(self):
        self.assertEqual(self.client.post('/').status_code, 405)

    def test_security_headers(self):
        response = self.client.get('/')
        self.assertEqual(response['X-Frame-Options'], 'DENY')
        self.assertIn("script-src 'self'", response['Content-Security-Policy'])
        self.assertEqual(response['X-Content-Type-Options'], 'nosniff')

    def test_untrusted_host_is_rejected(self):
        self.assertEqual(self.client.get('/', HTTP_HOST='untrusted.example').status_code, 400)

    def test_compiled_assets_are_served_by_the_compatibility_host(self):
        response = self.client.get('/')
        asset = re.search(r'src="(/assets/[^\"]+\.js)"', response.content.decode()).group(1)
        bundle = self.client.get(asset)
        self.assertEqual(bundle.status_code, 200)
        self.assertIn('javascript', bundle['Content-Type'])
        bundle.close()
