---
name: visual-research
description: "This skill should be used when analyzing a competitor's brand identity, auditing visual brand elements, researching brand positioning, comparing brand aesthetics, evaluating competitor design language, or conducting systematic visual research on brand identity, logo systems, typography choices, color palettes, or design patterns for competitive analysis. Triggers on: 'research [brand]', 'visual research', 'brand research', 'brand visual audit', 'competitor visual analysis', 'analyze [brand] identity', 'brand audit', 'visual identity analysis', 'find images for [brand]', 'capture [brand] social'."
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
| `GEMINI_API_KEY` | Gemini Vision — color extraction, typography ID, composition analysis from captured images | Analyze | Claude's built-in vision via `Read` tool. Good quality, Gemini preferred for batch processing |

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
3. Ask: "Ready to proceed with these capabilities, or install something first?"
4. Record the capabilities in the output document's Setup section
5. Never block on missing optional tools — proceed with best available

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
  "known_campaigns": [],
  "client": "Your Client Name"
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
- **Instagram API** — 12 most recent posts with engagement data (curl, no auth)
- **YouTube thumbnails** — via yt-dlp if available
- **Agency case study images** — from Prismic/Sanity APIs or direct HTML extraction
- **Brand press kit** — downloadable assets from press pages

Download to organized directories: `instagram/`, `youtube/`, `agency/`, `press/`.

### Phase 4 — Analyze

Run vision analysis on the best 8-12 captured images.

**With Gemini Vision (`GEMINI_API_KEY` set):**
```
image: [path-to-image]
prompt: "Analyze this brand image. Extract: (1) dominant colors with hex values, (2) typography style and weight, (3) composition/layout pattern, (4) mood/energy, (5) what makes this distinctive vs competitors. Be specific — name fonts if identifiable."
```

**Without Gemini (fallback to Claude vision):**
Read each image file directly and analyze. Claude can extract colors, typography, composition, and mood from images natively.

Compile findings into the research doc: colors → Color Palette section, fonts → Typography section, composition → Layout & UX section.

### Phase 5 — Package

Generate two outputs: a markdown research document and a branded HTML report.

**5a. Markdown research document**

Read `references/brand-audit-framework.md` for the 13-section template. Populate every section with sourced data. Append an image inventory mapping each captured image to its report section.

Save as `[brand]-visual-research.md`.

**5b. HTML report**

Read `references/ce-styleguide.md` and apply all rules strictly.
Read `templates/report.html` for the page structure.

Populate the template with research findings:
1. Fill each of the 13 sections with content from the research doc
2. Embed key images (base64 for portability, or relative paths)
3. Render color swatches with actual extracted hex values
4. Populate the capabilities banner with the setup report
5. Update the header with brand name, agency, sector, and threat level
6. Save as `[brand]-visual-research.html`
7. Open in the user's browser

## Quality Checklist

Before marking research complete:

- [ ] Agency identified and case study images extracted
- [ ] Instagram posts downloaded — at least 6 images
- [ ] Website homepage captured
- [ ] Social grids captured — at minimum Instagram + one other platform
- [ ] 8+ images analyzed with vision model
- [ ] All 13 sections of research doc populated with sourced data
- [ ] Images organized and mapped to report sections
- [ ] Financial data includes date stamps
- [ ] Campaign data includes agency attribution
- [ ] HTML report generates and opens in browser
- [ ] HTML report follows CE styleguide (white bg, Larken/Inter/JetBrains Mono, red accent sparingly)
