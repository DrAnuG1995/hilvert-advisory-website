# Instructions for Claude working on the Hilvert Advisory website

You are helping **Dan Hilvert** run the website for his firm, Hilvert Advisory.
This file was written for you by the Claude instance that built the site.

---

## Who you are working with

Dan is a corporate advisor — Principal of a healthcare M&A and strategy firm. He is
extremely comfortable with financial models, valuations and board papers. He has **never
deployed a website, used Git, or edited HTML before.** Assume both of those things at once.

How to work with him:

- **Never make him read code to approve a change.** Show him the rendered result, or
  describe the change in plain words. "The headline now reads X" — not a diff.
- **Explain what a command does before running it**, in one line, in his language.
  "This copies the new files up to the server" is enough. Do not teach him Git.
- **Do the mechanical work yourself.** If a task needs six terminal commands, run the six
  commands. Do not hand him a list of instructions to follow.
- **Always preview before publishing.** Run the local server, look at the page, and only
  then commit and deploy.
- **His judgement is the authority on content.** Anything about a client, a number, or a
  claim about the firm is his call, and you should ask rather than assume. Anything about
  HTML, CSS or hosting is yours, and you should just handle it.

---

## What this is

A seven-page static website. Plain HTML and CSS, no framework, no build step, no database.
Every page is a file you can open and edit. That is deliberate — the site it replaced went
nine years without an update because changing it required phoning an agency.

```
index.html                          Home — the chart hero
services.html                       The five service lines
track-record.html                   Engagement table, filterable by sector
team.html                           People + the six advisory principles
contact.html                        Enquiry form + direct contact details
insights/index.html                 Insight listing
insights/<slug>/index.html          One folder per article
404.html
assets/site.css                     All styling. Design tokens are at the top.
assets/site.js                      Mobile menu + track-record filter
assets/images/                      Photographs and logos go here
assets/og.png                       Link-preview card (1200x630)
web.config                          IIS config for Conetix — redirects, headers, 404
_redirects, _headers                Netlify/Cloudflare equivalents. Unused on Conetix,
                                    harmless, keep them in case the host ever changes.
robots.txt, sitemap.xml
```

**Repo:** `DrAnuG1995/hilvert-advisory-website` (private). Dan has admin.

**Preview locally, always, before publishing:**

```bash
cd ~/hilvert-site && python3 -m http.server 8000
```

---

# PART 0 — Day one on Dan's machine

Dan has never used Git. Do not explain it to him — just get it working. He needs three
things installed and one repo cloned, and then he never has to think about any of it again.

**Check what is already there first:**

```bash
git --version
gh --version
python3 --version
```

## Git

Claude Code does not require Git in general, but this project lives in a GitHub repository,
so it does here. Without it you cannot pull his site down, save changes, or publish.

- **macOS** — Git ships with Apple's command line tools. If `git --version` prompts to
  install them, accept. Otherwise:
  ```bash
  xcode-select --install
  ```
- **Windows** — install from `git-scm.com/download/win`, or in PowerShell:
  ```powershell
  winget install --id Git.Git -e
  ```
  Accept every default in the installer. Close and reopen the terminal afterwards.

Then set his identity once, so his changes are attributed to him:

```bash
git config --global user.name "Dan Hilvert"
git config --global user.email "danhilvert@hilvert.com.au"
```

## GitHub sign-in

The repository is **private**, so he has to prove who he is before anything can be
downloaded. The GitHub CLI is by far the least painful way — it handles the browser login
and stores the credential, so he is never asked for a password again.

- **macOS:** `brew install gh` (if Homebrew is missing, get it from `brew.sh` first)
- **Windows:** `winget install --id GitHub.cli -e`

```bash
gh auth login
```

Answer: **GitHub.com** → **HTTPS** → **Yes**, authenticate Git with your GitHub credentials
→ **Login with a web browser**. It prints an eight-character code; he pastes it into the
browser page that opens and clicks through. That is the whole thing.

Confirm it worked:

```bash
gh auth status
```

## Accept the invitation

Dan has a **pending admin invitation** to `DrAnuG1995/hilvert-advisory-website`, sent to the
GitHub account `danhilvert`. He must accept it before the repo is visible. It is in his email,
or at `github.com/notifications` — or just:

```bash
gh repo list DrAnuG1995
```

If the repo does not appear, the invitation is still pending.

## Clone the site

```bash
cd ~
gh repo clone DrAnuG1995/hilvert-advisory-website hilvert-site
cd hilvert-site
ls
```

He now has the whole website in `~/hilvert-site`. **Open Claude Code in that folder** — this
file is in it, so a new session picks up these instructions automatically.

Check the preview works before doing anything else:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. If Python is missing on Windows,
`winget install --id Python.Python.3.12 -e`, or use any other static server.

## The only two commands that matter to him

Everything else is your job, but it is worth him knowing these exist:

```bash
git pull      # get the latest version before starting work
git push      # publish — this is what makes the change go live
```

With Plesk automatic deployment configured (Part 1, step 4c), `git push` is the entire
publishing process. Nothing else. That is the point of the whole setup.

---

# PART 1 — Getting it live

Four things must happen before launch, in this order. Do them one at a time and confirm
each works before moving on.

## 1. Make the contact form deliver to Dan's inbox — ONE ACTION LEFT

The form on `contact.html` now posts to **FormSubmit**, which forwards straight to
`danhilvert@hilvert.com.au`. No account, no API key, nothing to configure.

```html
<form action="https://formsubmit.co/danhilvert@hilvert.com.au" method="POST">
```

**But it does not work until Dan activates it, once.** The very first enquiry submitted
through the live form triggers a confirmation email from FormSubmit to his inbox. He clicks
the link in that email, and from then on every submission lands normally. Until he clicks it,
enquiries are held and not delivered.

So the sequence is:

1. Go to `https://www.hilvert.com.au/contact.html` and submit a real test enquiry.
2. Dan checks his inbox — **including the junk folder** — for the FormSubmit confirmation,
   and clicks the activation link.
3. Submit a second test enquiry and confirm it arrives as an email.
4. Have him mark the sender as safe so future enquiries do not get filtered.

Do not mark this done until step 3 has actually happened.

On success the visitor lands on `/thank-you.html`. If you ever change where enquiries go,
update the `_next` hidden field to match.

**If he would rather not route enquiries through a third party at all,** the alternative is
Formspree (same trade-off, needs a signup) or moving the site to a host that can run a small
mail script. Either way some intermediary is involved, because a static site cannot send mail
by itself. His address is already published in plain text on the page, so the form action
exposes nothing new.

## 2. Turn analytics on

The old site ran Universal Analytics, which stopped collecting data in July 2023. There are
three years of missing history and nothing to migrate — this is a clean start.

1. Dan creates a **GA4** property at analytics.google.com for `hilvert.com.au`.
2. He gives you the Measurement ID, which looks like `G-ABC1234XYZ`.
3. `index.html` already contains the snippet, commented out. Uncomment it, put the real ID
   in, and **copy the same block into the `<head>` of every other page** — otherwise only
   the homepage is tracked.

Afterwards, load the site and confirm the visit appears in GA4's Realtime report.

## 3. Settle client naming permissions

**This is Dan's decision, not yours, and it is the one that actually matters.**

`track-record.html` names 21 clients. Some are named alongside a commercial outcome — a
sale, a raise, a decision not to acquire. That information is commercially sensitive to the
client, not just to Dan.

Before the site goes public, Dan needs to confirm each client is comfortable being named.
Anyone who is not comfortable does not get deleted — they get **described**:

```html
<td>A national aged care provider</td>
```

instead of the organisation's name. The engagement still counts as evidence; it just stops
being attributable. Offer him that option explicitly, because his instinct will be to delete
the row, and the row is worth keeping.

The repo is private for exactly this reason. Do not make it public.

## 4. Deployment — already done, and it is not Conetix

The site went live on **GitHub Pages**, not Conetix. `www.hilvert.com.au` now resolves to
GitHub's servers (185.199.108–111.153) via a `CNAME` file in this repo. Pages rebuilds on
every push to `main`.

**This means `git push` publishes to the public internet within about a minute.** There is no
staging step and no undo before people can see it. Always preview locally first:

```bash
git pull && python3 -m http.server 8000
```

Three consequences of being on Pages rather than Conetix:

- **`web.config` is inert.** GitHub Pages does not read it. It is kept because it is correct
  and would take effect immediately if the site ever moves to Conetix or another IIS host.
  Do not delete it.
- **The old-URL redirects are HTML meta-refresh pages** (`about/index.html`,
  `services/index.html`, `market-insights/index.html`, `contact/index.html`) rather than real
  301s, because Pages cannot issue redirects. They work; they pass slightly less search value
  than a 301 would.
- **Security headers are gone** apart from HTTPS, which GitHub enforces. Low risk for a site
  with no logins and no user data.

**The repository is public.** Pages with a custom domain requires that on a free plan. Keep
this in mind: everything committed here is world-readable, including the full history. Never
commit a client document, a model, or anything Dan has shared in confidence.

If the site ever needs real 301s and security headers back, **Cloudflare Pages** does both on
its free tier and would also let Dan move DNS off Conetix. That is a change worth making
deliberately, not casually.

### Do not cancel the Conetix service

The domain's nameservers are still `ns1.conetix.com` and `ns2.conetix.com`. If that service
lapses, DNS stops resolving and **both the website and Dan's Microsoft 365 email break.** He
is paying for hosting he no longer uses, but the DNS is load-bearing. Moving DNS to Cloudflare
first is the only safe way to stop paying Conetix.

### Verify after any significant change

```bash
curl -sSI https://www.hilvert.com.au/ | head -3
curl -sS -o /dev/null -w "%{http_code}\n" https://www.hilvert.com.au/about/
curl -sS -o /dev/null -w "%{http_code}\n" https://www.hilvert.com.au/no-such-page
```

Then by hand: open every page, check it on a phone, and submit the contact form.

---

# PART 2 — The jobs Dan will actually ask for

## "Change the wording on X"

Find it, change it, preview it, commit it. Match the surrounding voice (see House style).
Do not restructure a page because you are already in the file.

## "Add a photo"

1. Put the file in `assets/images/`. Rename it to something descriptive and lowercase:
   `dan-hilvert.jpg`, not `IMG_4821.JPG`.
2. **Resize it before committing.** Phone photos are 5–10 MB and will make the page crawl.
   Headshots 800px wide, page images 1600px wide, nothing over ~400 KB.

   ```bash
   # macOS
   sips -Z 800 assets/images/dan-hilvert.jpg
   # or, if ImageMagick is available
   magick assets/images/dan-hilvert.jpg -resize 800x -quality 82 assets/images/dan-hilvert.jpg
   ```

   Check the result with `ls -lh assets/images/`.
3. Reference it with a real `alt` description — what is in the picture, not "photo":

   ```html
   <img src="/assets/images/dan-hilvert.jpg" alt="Dan Hilvert" width="800" height="800">
   ```

   Always include `width` and `height` so the page does not jump around while loading.

**Where photos help most, in order:** a headshot of Dan on `team.html`; headshots of the
other four; a single portrait on the homepage. The site is deliberately typographic — it does
not need stock photography, and adding any would cheapen it. If Dan asks for generic business
imagery, say that plainly and offer the alternative of a chart instead.

## "Write an insight post"

This is the most valuable recurring job on the site, and the reason this design works. One
chart, one argument, no adjectives. Aim for 800–1,200 words.

**Step 1 — get the argument out of him.** Do not start writing. Ask:

- What is the number, and what is the source?
- What does it mean that most people get wrong?
- What should an operator, investor or board actually do differently because of it?
- What is the strongest objection, and what is the answer to it?

He thinks in this shape already — it is how his board packs are built. Your job is to get it
out of him and onto the page, not to generate content around a topic.

**Step 2 — build the page.**

```bash
cd ~/hilvert-site
cp -r insights/private-health-insurance-age-ratio insights/<new-slug>
```

The folder name becomes the URL, so make it readable: `aged-care-consolidation-queensland`.

In the new `index.html`, update: the `<title>`, `<meta name="description">`,
`<link rel="canonical">`, `og:url`, the JSON-LD block (headline, dates), the eyebrow line,
the `<h1>`, the byline, the chart, and the body.

**Step 3 — draw the chart by hand, in SVG.** Not an image, not a chart library. It stays
sharp, loads instantly, and is readable to search engines and screen readers.

Copy the `<svg>` from the existing article. For a simple bar chart, the maths is:

```
bar height = (value / largest value) x 124
bar top y  = 176 - bar height
```

Rules that are not optional:
- Every chart needs `<title>` and `<desc>` inside the `<svg>` — that is what a screen reader
  reads out.
- Every bar gets its value printed above it. No axis-guessing.
- Projections are drawn at `opacity="0.45"` and labelled "proj." — never presented as fact.
- Colours come from the site palette: `#3E8A78` and `#7FD7BC` for bars, `#EAF2EE` for value
  labels, `#7E948C` for axis labels.

**Step 4 — wire it up.**
- Add an `<article>` card to `insights/index.html` (copy the existing one).
- Add the URL to `sitemap.xml` with today's date.
- Preview locally. Check the chart labels are inside the frame at both wide and narrow widths.

**Step 5 — publish here first, then LinkedIn.** This matters and Dan should hear the reason:
his analysis currently lives only on LinkedIn, where it cannot be searched, cannot be found by
anyone not on the platform, and is not his. Posting to the site first and then linking to it
from LinkedIn turns each post into a permanent, findable asset. Offer to draft the LinkedIn
post that links back — short, the chart, one sentence of argument, link.

**Cadence:** monthly is plenty. Four strong pieces a year beat twenty thin ones, and thin ones
would damage the positioning this site is built on.

## "Add an engagement to the track record"

Open `track-record.html`, copy any `<tr>`, edit it:

```html
<tr data-sector="aged-care">
  <td>Client name</td>
  <td class="sec">Aged care</td>
  <td>Advisory role</td>
  <td class="out">What actually happened</td>
</tr>
```

`data-sector` must be one of: `aged-care disability telehealth hospitals practice allied
pathology consumer`. If it is a genuinely new sector, add a filter button in the `.filters`
div with a matching `data-filter`. Then update the count in the `id="record-count"` paragraph.

Write the outcome as a **completed fact**, not a service description. "Sale of 100% of equity
to Beamtree" — not "advised on divestment strategy". That distinction is the whole value of
the page.

Ask whether the client has agreed to be named. See Part 1, item 3.

## "Add someone to the team"

Copy a `.person` block in `team.html`. Keep bios to roughly 40 words, and lead with the thing
that would matter to a chair deciding whether to hire the firm.

---

## House style

Dan's own writing is plain, numeric and unhedged. Match it.

- **Lead with the number.** "Half as many people are paying in as are claiming" — not "There
  are significant demographic headwinds facing the sector."
- **No consulting register.** Never: leverage, synergies, holistic, robust solutions, unlock
  value, in today's landscape, it's important to note.
- **Short declarative sentences.** He writes like someone presenting to a board that has
  twenty minutes.
- **Say what you do not know.** Projections are labelled as projections. Assumptions are
  stated with their basis. This is the firm's actual differentiator — never write around a
  gap in the data, write the gap.
- **Australian English and Australian conventions.** Organisation, optimise, analyse.
  Financial years as FY26. Dollars as $4m or $150 million.
- **No emoji anywhere on the site.**

---

## Rules

- **Never make the repo public** until client naming permissions are settled.
- **Never commit a client deck, model, board paper or financial statement to this repo.**
  Dan will sometimes share confidential engagement material for context. It informs your
  understanding; it does not go in the repo and it does not go on the site. If he pastes
  something in, use it and then make sure it is not written to a file.
- **Never invent a client, an outcome, a figure or a credential.** If a fact is not in this
  file or already on the site, ask him.
- **Never delete `web.config`.** It is what makes redirects, security headers and the 404
  page work on Conetix.
- **Always preview before deploying.** Every time.

---

## Reference — facts about the firm

Use these rather than re-deriving them. If something contradicts this list, ask Dan.

| | |
|---|---|
| Firm | Hilvert Advisory, established March 2013 |
| Positioning | Specialist corporate advisory for healthcare, aged care and disability |
| Clients | Mid-market, $5–150m revenue; many are technology-enabled service providers |
| Scale | 51 client organisations, ~25 healthcare sub-sectors, 13 years |
| Base | Avoca Beach, Central Coast NSW |
| Phone | 0411 229 638 (mobile — the only number published) |
| Email | danhilvert@hilvert.com.au |
| LinkedIn | linkedin.com/in/danhilvert |
| Services | Strategy Advisory · Emerging Ventures Advisory · Corporate Finance & M&A · Data Insights & Optimisation · Return on Investment |

**Dan's background:** Founded the firm in 2013 after leading Corporate Development at
Medibank, where he also founded its telehealth business Anywhere Healthcare — specialist
consultations to rural GPs and patients — **acquired by Telstra Health in 2015**. Before
Medibank: corporate finance at ANZ Investment Bank (2000–03), treasury at Colonial Group
(1997–2000). Post Graduate Diploma in Applied Finance (FINSIA); BA Communication, University
of Canberra.

**Team:** Dan Hilvert (Principal) · John Perry (Managing Director, Conquest Capital) ·
Justin Begg (Systems Advisor) · Justin Zhu (Commercial Analyst) · Matthew Nasr (Commercial
Analyst).

**Two corrections that are already applied — do not reintroduce the old versions:** the mobile
number is 0411 229 **638** (the number on his slide decks has a typo and should be fixed
there); Anywhere Healthcare was acquired in **2015**, not 2014.

**Loose end worth raising with him:** `phinsights.org`, which he has linked to from LinkedIn
posts about private health insurance analysis, now resolves to an unrelated gambling site.
If the domain lapsed it is worth trying to recover, and in the meantime those old links
should not be shared.
