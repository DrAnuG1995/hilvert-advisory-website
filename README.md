# Hilvert Advisory — website

> **Using Claude Code on this project?** Open this folder in Claude Code and it will read
> [`CLAUDE.md`](CLAUDE.md) automatically. That file is the full manual: installing Git,
> cloning the repo, getting the contact form delivering to your inbox, deploying to Conetix,
> adding photos, and writing insight posts. Start there.

Static HTML. No build step, no framework, no database. Every page is a plain file you can
open in a text editor and change. Deploys to Netlify, Cloudflare Pages, or any static host.

## Files

```
index.html                 Home
services.html              The five service lines
track-record.html          Engagement table (filterable)
team.html                  People + the six advisory principles
contact.html               Enquiry form + direct details
insights/index.html        Insight listing
insights/<slug>/index.html One article per folder
404.html
assets/site.css            All styling
assets/site.js             Mobile nav + track-record filter
assets/og.png              Link-preview image (1200×630)
assets/favicon.svg
robots.txt  sitemap.xml    Search
_redirects  _headers       Netlify/Cloudflare equivalents (unused on Conetix)
web.config                 Conetix/IIS: old-URL 301s, security headers, 404 page
CLAUDE.md                  Full operating manual, written for Claude Code
```

## Before it goes live — three things

1. **Contact form.** `contact.html` posts to `https://formspree.io/f/REPLACE_ME`.
   Create a free Formspree form (or equivalent) and paste the real endpoint in.
   Until then the form will not deliver.
2. **Analytics.** `index.html` has a commented-out GA4 snippet. Create a GA4 property,
   replace `G-XXXXXXX`, uncomment, and copy the same block into the other pages' `<head>`.
   (The old site ran Universal Analytics, which stopped collecting data in July 2023.)
3. **Client naming permissions.** `track-record.html` names 21 clients, taken from the
   January 2026 one-pager. Confirm each is happy to be named publicly. Anyone who is not
   becomes a description — "a national aged care provider", "an ASX-listed acquirer" —
   rather than being dropped.

## Adding an engagement

Open `track-record.html`, copy any `<tr>` in the table, and edit it:

```html
<tr data-sector="aged-care">
  <td>Client name</td>
  <td class="sec">Aged care</td>
  <td>Advisory role</td>
  <td class="out">What actually happened</td>
</tr>
```

`data-sector` must match one of the filter buttons above the table:
`aged-care disability telehealth hospitals practice allied pathology consumer`.
Then bump the count in the `id="record-count"` paragraph.

## Adding an insight

1. Duplicate `insights/private-health-insurance-age-ratio/` and rename the folder —
   the folder name becomes the URL.
2. Edit the `<title>`, `<meta name="description">`, `<link rel="canonical">`,
   `og:url`, the JSON-LD block, and the body.
3. Add a card to `insights/index.html` (copy the existing `<article>`).
4. Add the new URL to `sitemap.xml`.

Publish here first, then post the link to LinkedIn — that way the analysis lives at an
address the firm controls and search engines can index, rather than only on the platform.

## Charts

Charts are hand-written inline SVG, not an image and not a library, so they stay sharp,
load instantly and remain readable to search engines and screen readers. Copy the `<svg>`
in the insight article as a starting point. Every chart needs a `<title>` and `<desc>`
inside the SVG — that is what a screen reader announces.

## Editing nav or footer

Each page is standalone, so the header and footer appear in every file. If you change a
nav item, change it in all of them (find-and-replace across the folder works fine).
That is the trade for having no build step.

## Hosting

The site is hosted with **Conetix** (Brisbane) on **Plesk for Windows**. The web root is
`httpdocs`. Plesk pulls directly from this GitHub repository, so publishing a change is
`git push` and nothing else. Full setup steps are in `CLAUDE.md`, Part 1.

## Local preview

```bash
cd hilvert-site && python3 -m http.server 8000
```

Then open http://localhost:8000

## Design notes

- Colours, type and spacing all live as CSS custom properties at the top of `assets/site.css`.
- Type: Newsreader (display), Source Sans 3 (body — the same face as the decks),
  IBM Plex Mono (labels and figures).
- The site is deliberately single-theme: dark, quantitative, closer to a board pack than a
  brochure. That is the whole point of the direction.
