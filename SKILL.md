---
name: visual-research
description: "This skill should be used when analyzing a competitor's brand identity, auditing visual brand elements, researching brand positioning, comparing brand aesthetics, evaluating competitor design language, or conducting systematic visual research on brand identity, logo systems, color palettes, or design patterns for competitive analysis. Triggers on: 'research [brand]', 'visual research', 'brand research', 'brand visual audit', 'competitor visual analysis', 'analyze [brand] identity', 'brand audit', 'visual identity analysis', 'find images for [brand]', 'capture [brand] social'."
---

# Visual Research

Full-pipeline skill for researching a brand's visual identity, capturing imagery from every available source, and packaging it into a branded HTML report with a 13-section competitive analysis.

## Setup

Before starting, check available tools and build a capabilities report.

**Required:**
- `curl` — Instagram API calls, direct image downloads. Pre-installed on macOS/Linux.

**Recommended (API keys):**

| Key | What it powers | Phase | Fallback |
|-----|---------------|-------|----------|
| `GEMINI_API_KEY` | Gemini Vision — color extraction, composition analysis from captured images | Analyze | Claude's built-in vision via `Read` tool. Good quality, Gemini preferred for batch processing |

Check: `echo $GEMINI_API_KEY`

**Optional (CLI tools):**

| Tool | What it powers | Phase | Install | Fallback |
|------|---------------|-------|---------|----------|
| Playwright | Full-page screenshots of websites, social grids, app stores | Capture | `npx playwright install chromium` | `web_fetch` for text content. Loses visual capture |
| yt-dlp | YouTube/TikTok video thumbnails | Extract | `pip3 install yt-dlp` | `web_search` for campaign stills from press |
| Scrapling | Anti-bot scraping for protected sites | Capture/Extract | `pip3 install scrapling` | `web_fetch` — works for most sites |

Check each: `which playwright`, `which yt-dlp`, `python3 -c "import scrapling" 2>/dev/null && echo ok`

**Setup behavior:**
1. Check each prerequisite and report what's available
2. For missing items, explain what the user loses and how to install
3. **STOP and wait for the user to confirm before proceeding.** Present a clear summary like:

   ```
   Ready:     Playwright, yt-dlp, curl
   Missing:   GEMINI_API_KEY (vision analysis will use Claude instead)
              Scrapling (will use web_fetch fallback)

   Install now, or proceed with what's available?
   ```

   Do NOT continue to Phase 1 until the user explicitly says to proceed.
4. Record the capabilities in the output document's Setup section

## Input

Accept a brand config inline or as JSON:

```json
{
  "brand": "Brand Name",
  "website": "https://example.com",
  "social": {
    "instagram": "handle",
    "tiktok": "handle",
    "youtube": "handle",
    "x": "handle"
  },
  "known_agencies": [],
  "known_campaigns": []
}
```

If the user provides just a brand name, discover the rest during Phase 1.

## Pipeline

```
DISCOVER → CAPTURE → EXTRACT → ANALYZE → PACKAGE
```

### Phase 1 — Discover

Find agency relationships, campaigns, and source URLs.

Read `references/source-discovery-guide.md` for detailed search strategies.

Core searches:
```
web_search "[Brand] rebrand agency case study"
web_search "[Brand] brand identity agency"
web_search "[Brand] campaign [Year] case study"
web_search "[Brand] [Agency] behance"
```

Check the brand's press room (`/press`, `/newsroom`, `/media`). Verify social handles exist and are public.

**Output:** List of source URLs for capture, confirmed social handles, agency identification.

### Phase 2 — Capture

Screenshot key brand touchpoints. Output to `captures/` directory.

If Playwright is available:
```bash
playwright screenshot --full-page "https://[brand-website]" captures/website-homepage.png
playwright screenshot "https://www.instagram.com/[handle]/" captures/instagram-grid.png
playwright screenshot "https://www.tiktok.com/@[handle]" captures/tiktok-grid.png
playwright screenshot "https://www.youtube.com/@[handle]" captures/youtube-channel.png
```

Also capture: app store pages, campaign pages, and agency case study pages found in Phase 1.

**Without Playwright:** Use `web_fetch` to grab page content as text. Note visual capture was skipped.

### Phase 3 — Extract

Pull actual images from APIs and CDNs.

Read `references/image-extraction-techniques.md` for detailed recipes.

Core extractions:

#### Hero Image Sourcing (Priority — Slot 0)

The hero image is the most important visual in the report. It must be:
- **High resolution** (minimum 1200px wide, ideally 1600px+)
- **Brand-representative** — shows the brand's actual visual identity, not just something with the logo on it
- **Professionally produced** — press photos, campaign key art, homepage heroes. Not phone photos, not user-generated content
- **Compositionally suitable** — works at 16:9 aspect ratio with a gradient overlay on the left 40% (text will sit there)

**Search in this priority order, collecting candidates into `hero-candidates/`:**

1. **Homepage hero image**
   - Use Playwright to screenshot the above-the-fold hero section
   - Also extract the actual image URL from the page source (look for hero/banner container `<img>` tags, CSS `background-image`, `<video poster>`)
   - Apply resolution maximizer (see below) to get the full-size asset
   - Check if the CMS (DatoCMS, Contentful, Prismic, Sanity) exposes the raw asset URL without resize params

2. **Press/media kit hero imagery**
   - Check `/press`, `/newsroom`, `/media`, `/brand` pages for downloadable high-res imagery
   - Look for "brand assets" or "media kit" download links
   - Press photos from product launches or conferences are often the highest quality

3. **Agency case study hero**
   - Behance/Dribbble case studies typically lead with a hero image that the agency art-directed
   - These are purpose-built to showcase the brand's visual identity at its best
   - Apply resolution maximizer to Prismic/Sanity/CMS URLs

4. **Campaign key art**
   - Search: `web_search "[Brand] campaign key art [Year]"`
   - Search: `web_search "[Brand] brand campaign hero image"`
   - Trade press (It's Nice That, Creative Review, The Drum) often publishes agency-supplied high-res campaign imagery
   - Conference/event photography from the brand's own events

5. **Product marketing screenshots**
   - Product pages often have polished, art-directed hero shots
   - App Store/Play Store feature graphics (these are required to be 1024x500+)
   - Marketing landing pages for specific features/products

6. **Social media — last resort only**
   - Only if nothing above yields a usable image
   - Prefer official brand posts over user photos
   - Instagram carousel first slides are usually highest production value
   - Avoid: phone photos, UGC, nighttime shots, grainy/compressed images

**Selection criteria — choose the best candidate:**

| Criterion | Weight | What to check |
|-----------|--------|---------------|
| Resolution | High | Must be ≥1200px wide. Prefer ≥1600px |
| Brand representation | High | Does it show the brand's visual identity system (colors, style, aesthetic)? |
| Production quality | High | Professional photography/design, not phone shots |
| Composition | Medium | Works at 16:9 with left-side overlay? Subject on right half preferred |
| Recency | Medium | Current branding, not a 5-year-old campaign |
| Uniqueness | Low | Not a generic stock photo or widely-circulated press image |

If Gemini or Claude vision is available, load the top 3 candidates and evaluate against these criteria. Pick the best one. Save as `hero-candidates/hero-selected.jpg` and note the source.

**If no candidate meets minimum quality:** Use the best available option but flag it in the research doc: "Hero image is below ideal quality — [reason]. Recommend replacing if a better source is found."

- **Official logo** — Priority extraction. Try these sources in order until you get a clean, full logo on a solid or transparent background:
  1. **Brand press/media kit** — `/press`, `/newsroom`, `/media`, `/brand`, `/brand-assets`. Many brands offer downloadable logo files (PNG/SVG)
  2. **Brandfetch / brand databases** — `web_search "[Brand] logo PNG transparent"`, `web_search "[Brand] logo brandfetch"`
  3. **Wikipedia / Wikimedia Commons** — Often has high-quality SVG/PNG logos
  4. **Agency case study** — Behance/Dribbble posts often show the logo isolated on a clean background
  5. **Homepage extraction** — If the logo is in the site header, screenshot just the header area or extract the logo `<img>` URL from the page source

  **Logo quality requirements:** The image must show the **complete wordmark/logomark** — no cropping, no partial text. Prefer images where the logo sits on a white, light, or transparent background with clear space around it. If the best available logo is small or embedded in a busy scene, note it as low-quality and flag during verification.

  Save to `press/[brand]-logo.png` (or `.jpg`/`.svg`).

- **Instagram API** — 12 most recent posts with engagement data (curl, no auth)
- **YouTube thumbnails** — via yt-dlp if available
- **Agency case study images** — from Prismic/Sanity APIs or direct HTML extraction
- **Brand press kit** — downloadable assets from press pages

Download to organized directories: `instagram/`, `youtube/`, `agency/`, `press/`.

#### Image Resolution Maximizer

Apply this procedure to **every** image URL before downloading. The goal is to always get the highest resolution version available.

1. **Strip CDN resize parameters.** Many CDNs append width/height params that downsample:
   - Contentful/Prismic: remove `?w=800` or `&w=800`, or set `?w=2000`
   - Cloudinary: change `/w_400/` to `/w_2000/` or remove transform path segments
   - Imgix: remove `?w=`, `?h=`, `?fit=` params
   - Shopify: change `_200x200` suffix to `_2000x2000` or remove it
   - WordPress: remove `-800x600` before the extension
   - DatoCMS: remove query params for original, or set `?w=2000`
   - Sanity: remove `?w=` param for full resolution
   - Vercel/Next.js: extract the `url` param from `/_next/image?url=...&w=640&q=75`, fetch directly
   - Webflow: remove `-w-800` or replace with larger value
   - Squarespace: change `format=500w` to `format=2500w` or remove param
   - General: try removing all query parameters and check if the raw URL returns a larger image

   See `references/image-extraction-techniques.md` for the full CDN pattern reference.

2. **Check srcset for larger versions.** When extracting from HTML:
   - Parse `srcset` attribute for the highest `w` descriptor
   - Check `data-src`, `data-full`, `data-original` attributes
   - Look for `<picture>` elements with larger `<source>` URLs

3. **Verify resolution after download.** For critical images (hero, logo, campaign heroes):
   ```bash
   sips -g pixelWidth -g pixelHeight [image]  # macOS
   ```
   If width < 800px, flag as low-res and attempt alternative sources.

4. **Prefer PNG/WebP over JPEG** when both are available at the same size (lossless > lossy for brand assets).

### Phase 4 — Analyze

Run vision analysis on the best 8-12 captured images.

**With Gemini Vision (`GEMINI_API_KEY` set):**
```
image: [path-to-image]
prompt: "Analyze this brand image. Extract: (1) dominant colors with hex values, (2) composition/layout pattern, (3) mood/energy, (4) what makes this distinctive vs competitors. Be specific."
```

**Without Gemini (fallback to Claude vision):**
Read each image file directly and analyze. Claude can extract colors, composition, and mood from images natively.

Compile findings into the research doc: colors → Color Palette section, composition → Layout & UX section.

### Phase 5 — Package

Generate two outputs: a markdown research document and a branded HTML report.

**5a. Markdown research document**

Read `references/brand-audit-framework.md` for the 13-section template. Populate every section with sourced data. Append an image inventory mapping each captured image to its report section.

Save as `[brand]-visual-research.md`.

**5b. HTML report**

Read `references/ce-styleguide.md` and apply all rules strictly.
Read `templates/report.html` for the page structure.

The template uses a full-width layout with hero block, pill-track navigation, and 12 report sections. The 13-section markdown research doc maps to the HTML report as follows:

| HTML report section | Content source from research doc |
|---|---|
| Hero + TL;DR | Synthesized — executive summary, threat level, one-sentence verdict |
| §01 Quick Facts | Section 01 |
| §02 Positioning | Section 02 |
| §03 Brand Identity | Merged: Section 04 (Color) + Logo |
| Dark Break / Signal | Synthesized — single most important strategic signal |
| §04 Brand Evolution | Section 03 |
| §05 Brand in Practice | Curated image grid from agency/social captures |
| §06 Digital Experience | Section 06 Layout & UX |
| §07 Assessment | Section 07 |
| §09 Brand Personality | Section 09 |
| §10 Social Strategy | Section 11 |
| §11 Campaigns | Section 12 Content & Campaign |

Section 13 (Audience & Community) content is absorbed into Social Strategy and Brand Personality.

Populate the template with research findings:
1. Write the TL;DR verdict — one punchy sentence capturing the brand's strategic position
2. Write the Signal — the single most important strategic insight from the research
3. Fill each section with content from the research doc using the mapping above
4. Render color swatches with actual extracted hex values in `{{SWATCH_N_HEX}}` / `{{SWATCH_N_NAME}}`
5. Fill the Quick Facts grid cells (`{{FACT_N_VALUE}}` / `{{FACT_N_LABEL}}`, N=1..8)
6. Fill the Brand Evolution timeline (`{{EVOLUTION_N_YEARS}}` / `{{EVOLUTION_N_TITLE}}` / `{{EVOLUTION_N_DESC}}`, N=1..4)
7. Generate `{{ASSESSMENT_ROWS}}` — each row must include a `data-rating` attribute on the Dimension `<td>`:
   `<tr><td data-rating="Exceptional">Cultural Relevance</td><td class="strength">Exceptional</td><td>Notes here</td></tr>`
   The `data-rating` value must match the rating text. This powers the mobile layout where the Rating column is hidden and its value is appended inline.
8. Embed images into `data-slot` positions (see procedure below)
9. Save as `[brand]-visual-research.html`

**STOP — DO NOT open in browser, DO NOT publish, DO NOT report completion.**
The report is NOT finished until Phase 5c runs and `verify/PASSED` exists.

10. Run Phase 5c — Visual Verification (below)
11. Only after `verify/PASSED` exists: open in the user's browser

**Image embedding procedure:**

The template has numbered image slots using `data-slot` attributes. Each `<img>` tag has a `data-slot="N"` and `data-aspect` indicating the expected aspect ratio.

| Slot | Section | Image source | Aspect |
|---|---|---|---|
| 0 | Hero | Best brand hero image (campaign, homepage) | 16:9 |
| 1 | TL;DR sidebar | Product or brand identity image | 3:4 |
| 2 | Brand Identity — Logo | Official logo on clean background (see logo extraction in Phase 3) | 16:9 |
| 3-8 | Brand in Practice | 6 curated brand images (agency work, social, campaigns) | 1:1 |
| 9 | Digital Experience | App or website screenshot | 16:9 |
| 10 | Campaign 1 — Hero | Primary campaign image | 16:9 |
| 11-13 | Campaign 1 — Supporting | 3 supporting campaign images | 16:9 |
| 14 | Campaign 2 — Hero | Primary campaign image | 16:9 |
| 15-17 | Campaign 2 — Supporting | 3 supporting campaign images | 16:9 |

**Image deduplication — CRITICAL:**

Before assigning images to slots, maintain an **Image Assignment Log**. For each image you embed:
1. Check if that image filename/URL already appears in the log
2. If it does, skip it and choose a different unused image
3. If no unused images remain, leave the slot with its placeholder

After all slots are assigned, review the log. If any image appears more than once, replace the duplicate with an unused image or revert it to the placeholder. **It is better to leave a slot empty than to show a duplicate image.**

For each slot with a captured image:

1. Convert the image to base64: `base64 -i captures/website-homepage.png -b 0` (macOS) or `base64 -w 0` (Linux)
2. Find the `<img>` tag with the matching `data-slot="N"` attribute
3. Replace the `src` attribute value with `data:image/png;base64,{BASE64}` (or `image/jpeg` for JPGs)
4. Update the `alt` text with an actual description of the image
5. Record the assignment in your Image Assignment Log: `slot N ← filename.jpg`

**Logo slot (slot 2) special handling:** The template uses `object-fit:contain` with padding for this slot so the full logo is always visible regardless of aspect ratio. Before embedding, visually verify the logo image shows the **complete** wordmark — if it's cropped or partial, find a better source. Logos are the single most recognizable brand element; getting this wrong is immediately obvious.

For slots without captured images, leave the transparent 1px placeholder (`data:image/gif;base64,R0lGODlh...`). The template renders gracefully with empty slots.

**5c. Visual verification**

After saving the HTML report, verify it renders correctly before opening in the browser or publishing. This catches cropping issues, missing images, layout breaks, and unreplaced placeholders.

**Step 1 — Screenshot the report at 8 positions (5 desktop + 3 mobile):**

```bash
mkdir -p verify

# Desktop (1280x800)
playwright screenshot --viewport-size="1280,800" "file:///path/to/[brand]-visual-research.html" verify/d-01-hero-tldr.png
playwright screenshot --viewport-size="1280,800" "file:///path/to/[brand]-visual-research.html#brand-book" verify/d-02-brand-identity.png
playwright screenshot --viewport-size="1280,800" "file:///path/to/[brand]-visual-research.html#brand-in-practice" verify/d-03-practice-ux.png
playwright screenshot --viewport-size="1280,800" "file:///path/to/[brand]-visual-research.html#campaigns" verify/d-04-campaigns.png
playwright screenshot --viewport-size="1280,800" "file:///path/to/[brand]-visual-research.html#vs-client" verify/d-05-comparison-footer.png

# Mobile (390x844)
playwright screenshot --viewport-size="390,844" "file:///path/to/[brand]-visual-research.html" verify/m-01-hero-tldr.png
playwright screenshot --viewport-size="390,844" "file:///path/to/[brand]-visual-research.html#brand-book" verify/m-02-brand-identity.png
playwright screenshot --viewport-size="390,844" "file:///path/to/[brand]-visual-research.html#campaigns" verify/m-03-campaigns.png
```

**Step 2 — Review each screenshot with vision:**

Read each screenshot file and check for these defects:

| Category | What to check |
|---|---|
| Missing images | Transparent/blank areas where an image should be (data-slot placeholders still visible) |
| Cropping | Images cut off showing wrong portion (e.g., logo showing partial text instead of full wordmark) |
| Layout breaks | Grid columns collapsed, text overlapping images, sections misaligned |
| Mobile responsiveness | Content overflowing viewport, horizontal scroll, text unreadable, grids not collapsing |
| Unreplaced placeholders | Any `{{MUSTACHE}}` text still visible in the rendered output |
| Styleguide violations | Red used outside section labels, heavy font weights on body, shadows or rounded corners |
| Empty sections | Entire report sections with no content (blank cards, empty grids) |
| Aspect ratio issues | Images stretched or squished — wrong `object-fit` for the content type |

**Step 3 — Fix detected issues:**

For each defect:
- **Cropping/aspect**: Change `object-fit` from `cover` to `contain` (add `background: #f5f5f5; padding: 40px`), or swap image source
- **Missing images**: Re-check file exists, re-encode to base64, re-embed into the HTML
- **Layout breaks**: Adjust inline styles or fix HTML structure
- **Unreplaced placeholders**: Fill with researched content or sensible default
- **Styleguide violations**: Correct colors, weights, or decorative elements

Apply fixes directly to the saved HTML file.

**Step 4 — Re-verify (max 3 passes):**

After fixing, re-screenshot only the sections that had issues and re-review. If all screenshots pass, write the gate artifact and proceed. If 3 passes exhausted, note remaining issues in the gate artifact and proceed — don't block indefinitely.

```bash
echo "PASSED — $(date -u +%Y-%m-%dT%H:%M:%SZ) — [X] defects found, [Y] fixed, [Z] remaining" > verify/PASSED
```

The `verify/PASSED` file is the gate artifact. Phase 5b's publish step checks for it. Do not proceed to browser open or report completion without it.

**Step 5 — Clean up:**

Delete screenshot PNGs from `verify/` after verification passes. Keep `verify/PASSED` — it is the gate artifact for the publish step.

## OpenClaw Deployment

This skill was designed for Claude Code running locally (no hard timeout). When running via OpenClaw sub-agents, the full pipeline will likely exceed the default 10-minute timeout — phases 1-4 alone (web research, screenshots, image extraction, vision analysis) take ~8-10 minutes, leaving no time for report assembly.

**Option A — Single agent, longer timeout (simplest)**

Set `timeout: 1200000` (20 min) on the sub-agent task. This gives enough headroom for the full pipeline in one shot.

**Option B — Two-agent split (recommended for reliability)**

Split the work across two sequential sub-agents:

| Agent | Phases | What it does | Expected time |
|-------|--------|-------------|---------------|
| **Gather** | 1-4 (Discover → Analyze) | Web research, screenshots, image downloads, vision analysis. Writes all raw data to `[brand]-raw-data.md` and organized image directories. | ~8-10 min |
| **Package** | 5 (Package) | Reads the raw data + images, assembles the 13-section research doc and branded HTML report. Can also fill gaps with quick web searches for business facts. | ~4-6 min |

The gather agent should save its output to a known location so the package agent can pick it up. Use the workspace directory for handoff.

**Sub-agent verification rule:** When using Option B, the Package agent must run Phase 5c itself. If a sub-agent reports "complete," the orchestrating agent MUST still verify `verify/PASSED` exists before accepting the result. Never trust a sub-agent's completion signal without checking the gate artifact.

**Option C — Parallel gather + sequential package**

For maximum speed, split Phase 1 (Discover) and Phases 2-3 (Capture + Extract) across parallel agents, then run Phase 4-5 sequentially once images are collected. Only worth the complexity for time-sensitive briefs.

## Quality Checklist

**Gate (must pass before reporting completion or opening browser):**

- [ ] `verify/PASSED` file exists — Phase 5c ran to completion
- [ ] HTML report passes visual verification — desktop and mobile screenshots reviewed
- [ ] No cropping, missing images, placeholder text, or layout breaks detected
- [ ] CE styleguide compliance confirmed via vision review (white bg, correct fonts, red accent sparingly)
- [ ] Mobile layout verified — grids collapse correctly, text readable, no overflow

**Content (verify during pipeline):**

- [ ] Agency identified and case study images extracted
- [ ] Instagram posts downloaded — at least 6 images
- [ ] Website homepage captured
- [ ] Social grids captured — at minimum Instagram + one other platform
- [ ] 8+ images analyzed with vision model
- [ ] All 13 sections of research doc populated with sourced data
- [ ] Images organized and mapped to data-slot positions
- [ ] Financial data includes date stamps
- [ ] Campaign data includes agency attribution
- [ ] TL;DR section has opinionated verdict and threat level
- [ ] Signal dark break contains the single most important strategic insight
- [ ] Campaign cards have hero images (data-slot 10, 14)
- [ ] Brand in Practice grid has at least 4 of 6 images populated
- [ ] No image file assigned to more than one data-slot (check Image Assignment Log)
- [ ] Assessment table rows include `data-rating` attribute on Dimension cells
- [ ] Hero image (slot 0) sourced from dedicated hero search — not just picked from Instagram batch
- [ ] Hero image resolution ≥1200px wide
- [ ] Hero image represents the brand's visual identity (not just "has the logo on it")
- [ ] Hero image is professionally produced (not a phone photo or UGC)
- [ ] All downloaded images passed through resolution maximizer (no CDN thumbnails)
