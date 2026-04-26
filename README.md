# K&K ProBuild — kkprobuild.com

Static marketing site for K&K ProBuild, a licensed Oregon general construction
business owned by Ezra Kiedrowski. Eagle Point, OR · Rogue Valley.

Plain HTML / CSS / JS. No build step. Hosted on **GitHub Pages** at the
custom domain `kkprobuild.com`.

---

## Local dev

The `package.json` / `serve.json` are kept for local previews only — they
do nothing on GitHub Pages.

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy via GitHub Pages

This site uses the same hosting pattern as `TheCRMWizards_website`.

**Initial setup (one time):**

1. From this directory, create the repo and push in one shot using the `gh` CLI:
   ```bash
   git init
   git add .
   git commit -m "Initial K&K ProBuild site"
   git branch -M main
   gh repo create elikiedrowski/kkprobuild_website --public --source=. --push
   ```
3. In the GitHub repo: **Settings → Pages**
   - Source: *Deploy from a branch*
   - Branch: `main`, folder: `/ (root)`
   - Custom domain: `kkprobuild.com` (the `CNAME` file in this repo
     already declares it; GitHub will verify automatically)
   - Enable *Enforce HTTPS* once the cert provisions (5–30 min)
4. In **Squarespace's domain manager** (where kkprobuild.com is registered —
   Google Domains was sold to Squarespace) → DNS settings:
   - **Apex `kkprobuild.com`** — four A records pointing at GitHub Pages:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **`www`** — CNAME pointing to `elikiedrowski.github.io`
     (replace with your GitHub username if different)

**Day-to-day deploys:** edit, commit, push to `main`. GitHub Pages
re-publishes within a minute.

```bash
git add .
git commit -m "Update gallery photos"
git push
```

**GitHub Pages specifics already wired:**

- `CNAME` file at root declares the custom domain
- `.nojekyll` at root tells GitHub to skip Jekyll processing (we want raw HTML)
- `404.html` at root is auto-served on missing paths
- `index.html` is auto-served at `/`

---

## File map

```
.
├── index.html          home (hero, services, mini-split stat, B/A, testimonials, plumbing block)
├── about.html          owner story, credentials, service area
├── services.html       full service detail w/ anchors (#general, #mini-splits, #plumbing, #decks, #adus)
├── gallery.html        filter tabs + before/after grid + lightbox
├── testimonials.html   review cards
├── contact.html        structured bid-request form → Web3Forms → ezra@kkprobuild.com
├── thank-you.html      post-submit confirmation
├── 404.html            custom 404
├── sitemap.xml         SEO sitemap
├── robots.txt          allow all, disallow /thank-you.html
├── css/styles.css      one stylesheet (Pacific NW brand: forest green + amber sunset)
├── js/main.js          mobile menu, reveal-on-scroll, gallery filter, lightbox, form
├── assets/images/      logo.png (full hex logo), logo-small.png (favicon/nav), logo-resized.jpg
├── CNAME               GitHub Pages custom domain declaration
├── .nojekyll           tells GitHub Pages to skip Jekyll processing
├── package.json        local dev only (`npm run dev` → `serve`)
└── serve.json          local dev routing for `serve` (ignored by Pages)
```

---

## Brand system

Derived from Ezra's hexagonal logo (eagle, mountain, sunset, forest, river).

| Token | Hex | Use |
|-------|-----|-----|
| `--forest-darkest` | `#14241a` | Hero background, footer, dark surfaces |
| `--forest` | `#2d4a2e` | Buttons, accents on light bg |
| `--amber` | `#d97706` | Primary CTA, hover, highlights |
| `--amber-light` | `#f59e0b` | Stat numbers, dark-mode highlights |
| `--cream` | `#faf6ee` | Page background |
| `--cream-warm` | `#f3ead8` | Alternating section background |
| `--ink` | `#1a1f1c` | Body text |

**Type:** Oswald (headings, condensed, industrial) + Inter (body, neutral).

---

## TODO before going live

These are the **placeholders you need to replace** before pointing the
domain:

| Placeholder | Where | What to do |
|---|---|---|
| `[CCB# TBD]` | All pages footer + credentials strip + JSON-LD schema | Replace with Ezra's real Oregon CCB license # (ask Ezra; visible at `search.ccb.state.or.us`) |
| `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` | `contact.html` line ~64 | Sign up at <https://web3forms.com>, verify `ezra@kkprobuild.com`, paste the access key |
| `Table Rock<br>Plumbing Solutions` placeholder boxes | `index.html`, `services.html` | Drop their real logo into `assets/images/table-rock-logo.png` and swap the `<div class="partner-logo-box">` for an `<img>` tag (commented in source) |
| `placeholder-before` / `placeholder-after` divs | `gallery.html`, `index.html`, `services.html` | Replace with real before/after photos when Ezra delivers them. See "Adding gallery photos" below |
| Testimonial copy | `index.html`, `testimonials.html` | Replace placeholder reviews with real ones. Names + project type + city |
| Service area list | `about.html`, `contact.html`, schema in `index.html` | Confirm with Ezra which Rogue Valley towns to claim |
| `123 Ironwood Drive` in JSON-LD `index.html` | Address in schema.org block | If Ezra wants the home address kept private (no walk-ins), swap for a P.O. box or just the city; the schema helps Google Maps pinpoint the business |

---

## Form backend (Web3Forms)

The contact form posts to `https://api.web3forms.com/submit` with these
hidden fields:

```html
<input type="hidden" name="access_key" value="REPLACE_WITH_WEB3FORMS_ACCESS_KEY">
<input type="hidden" name="subject" value="New estimate request — K&K ProBuild">
<input type="hidden" name="redirect" value="https://kkprobuild.com/thank-you.html">
```

Web3Forms is free for unlimited submissions. Setup: sign up with
`ezra@kkprobuild.com`, copy the access key, paste it into the form. Done.

If you outgrow Web3Forms (or want logging into Salesforce later, like
TheCRMWizards site), swap the form `action` for a Cloudflare Worker or
Railway endpoint. The form fields already follow web-to-lead naming.

There's a hidden `botcheck` honeypot field — bots fill it, JS swallows
the submit and silently redirects to thank-you.

---

## Adding gallery photos

When Ezra delivers before/after photos:

1. Drop them in `assets/images/gallery/` — name them clearly,
   e.g. `kitchen-eagle-point-before.jpg`, `kitchen-eagle-point-after.jpg`.
2. In `gallery.html` and `index.html`, replace `<div class="placeholder-before">`
   and `<div class="placeholder-after">` with `<div style="background-image: url('assets/images/gallery/kitchen-eagle-point-before.jpg');">`.
3. For the lightbox, add `data-before="..."` and `data-after="..."` attributes
   on the `<button class="ba-card">` element — `js/main.js` reads them.
4. Keep images **under 400KB each** (use Squoosh.app to compress) so the
   site stays fast on rural cell connections.

---

## SEO checklist (already wired)

- ✓ `<title>` and `<meta name="description">` per page
- ✓ Open Graph tags on home (extend to other pages later)
- ✓ Schema.org `GeneralContractor` JSON-LD on home (Google Local Pack)
- ✓ `sitemap.xml` and `robots.txt`
- ✓ Semantic HTML (`<main>`, `<nav>`, `<section>`)
- ✓ `tel:` links on phone numbers (mobile-tap to call)
- ✓ Canonical URLs

**Still to do for max local SEO:**

1. Create the **Google Business Profile** (single biggest local-SEO lever
   for a contractor). Link from the site footer once live.
2. Add **Bing Places** profile too — secondary but free.
3. Submit `sitemap.xml` to Google Search Console once domain is live.
4. List the business on **Oregon CCB** public lookup, **Yelp**, **Angi/HomeAdvisor**,
   **Nextdoor** — Nextdoor in particular drives local home-services leads.

---

## Compliance notes

**Plumbing partnership:** Oregon CCB regulations require K&K to display
Table Rock Plumbing Solutions' logo on any page that advertises plumbing
services, with disclosure that the work is performed by the partner.
This is already in place in `index.html` and `services.html#plumbing` —
do not remove the disclosure copy or partner-logo block when polishing.

**Services we do not advertise:** Drywall, painting, electrical. Per
Ezra's direction, the site does not list these as offered services and
also does not say "we don't do" them — they are silently omitted. If you
add new content, double-check no copy slips them in.

---

## Pre-launch checklist

- [ ] Ezra confirms copy reads correctly on all pages
- [ ] Real CCB # in place
- [ ] Web3Forms access key in place — submit test form, confirm it lands in Ezra's inbox
- [ ] Table Rock logo dropped in
- [ ] At least 3 real before/after pairs in gallery (placeholders OK at first if needed)
- [ ] Real testimonials substituted (or placeholder removed/labeled honestly)
- [ ] Test contact form submit → thank-you redirect works
- [ ] Test on a phone — Eagle Point cell service is rural, the site needs to be fast
- [ ] Domain pointed at Railway, HTTPS issued
- [ ] Submit sitemap to Google Search Console
- [ ] Create + verify Google Business Profile
