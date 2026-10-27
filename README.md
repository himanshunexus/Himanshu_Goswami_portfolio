# Himanshu Goswami — My Universe

A database-free React portfolio inspired by the BeHFaR space experience: Three.js particle galaxies, a GSAP scroll journey, interactive project constellations, telescope-lens project details, and a portrait contact scene. Fonts are bundled locally. No database, migrations, accounts, or paid PostgreSQL service is required.

## Run locally

Use Node.js 22.12+ (or 24 LTS).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Build and preview production:

```sh
npm run build
npm run preview
```

## Content

Edit [src/projects.js](src/projects.js) to update projects. The featured ML projects are [Loan Eligibility Predictor](https://github.com/himanshunexus/LOAN-ELIGIBLE-MODEL) and [Smart-Cart](https://github.com/himanshunexus/Smart-Cart). Bazar points to **https://bazar-new.onrender.com/**. Contact details and biography are in [src/main.jsx](src/main.jsx). The portrait is [public/images/contact-portrait.png](public/images/contact-portrait.png).

## Deploy to Render — recommended static site

Create a **Static Site** connected to `himanshunexus/Himanshu_Goswami_portfolio`:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- No environment variables or database needed.

[render.yaml](render.yaml) provides the same configuration for a Blueprint deployment. A new static site receives a new Render subdomain; it does not automatically replace the existing service.

## Keep the existing Render URL

The existing Python web service can serve the same compiled frontend through the database-free Django compatibility host:

- Build command: `pip install -r requirements.txt && npm ci && npm run build`
- Start command: `gunicorn portfolio.wsgi:application`
- Python: 3.12+ (required by the existing Django 6 dependency)
- Node: 22.12+ or 24 LTS
- Remove any previous migration/collectstatic commands from build or pre-deploy settings.
- No `DATABASE_URL` is used. Admin, ORM apps, sessions, and database configuration are disabled.

A Node web service can alternatively use `npm ci && npm run build` and `npm start`; [server.mjs](server.mjs) honors Render's `PORT`.

The old templates, models, migrations, and Tailwind sources are retained only as historical source; none is used by the new portfolio or deployment. Existing local SQLite data is not modified.

## Interaction and accessibility

- Scroll to travel through the universe, or use the scene navigation.
- Select a constellation by pointer, touch, Tab + Enter, or Space.
- Project dialogs trap keyboard focus; Escape closes them and restores focus.
- Contact has copy-email and direct mail links.
- Reduced-motion preferences disable animated travel and expose the biography in normal reading order.
- WebGL failure leaves the HTML content and project navigation usable.

## Validation

`npm run build` validates the production bundle. With Python dependencies installed, `python manage.py test core` checks the optional compatibility host without creating a test database. Browser verification should cover desktop/mobile navigation, all project dialogs, outgoing URLs, and reduced motion.

## Contact portrait and security review

The contact portrait uses the supplied likeness in [the generated image](public/images/contact-portrait.png). The built-in image-generation prompt is preserved in [the prompt record](public/images/contact-portrait-prompt.txt). [PortraitParticles](src/PortraitParticles.jsx) samples it into a WebGL point cloud: five-second reveal, an eight-second initial pause, four-second depth expansion/reformation, and a fading pointer trail. Rendering pauses offscreen or in a hidden tab. Reduced motion and WebGL failure retain a still portrait.

Smart-Cart is also featured, with its verified K-Means customer segmentation and Random Forest campaign-response pipelines.

Production hosts apply a same-origin Content Security Policy (inline styles are required by GSAP), frame blocking, MIME-sniffing protection, a referrer policy, and disabled camera/microphone/geolocation permissions. The Django host restricts hostnames, redirects HTTPS on Render, uses HSTS, and has no database, authentication, admin, or persistent sessions. Environment files are ignored. Dependency audits identify known advisories; they cannot guarantee absence of every security issue.

Run `npx playwright test` for desktop/mobile, all five project dialogs, security headers, blocked private paths, reduced motion, and the particle animation. Run `python manage.py test core` for the database-free Python host. Audit dependencies with `npm audit` and `pip-audit -r requirements.txt`.
