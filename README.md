# Visual Research

Analyze any brand's visual identity. A Claude Code skill by [Curious Endeavor](https://curiousendeavor.com).

---

A five-phase pipeline that discovers agency work, captures social presence, extracts images from APIs, runs vision analysis, and packages everything into a branded 13-section HTML report.

Built for brand strategists, creative directors, and anyone preparing competitive intelligence on a brand's visual identity.

## What it does

- **Discover** — Find agency relationships, campaign case studies, and press coverage via web search
- **Capture** — Screenshot websites, social grids, and app stores with Playwright
- **Extract** — Pull actual images from Instagram API, YouTube, Prismic CMS, and agency portfolios
- **Analyze** — Run vision analysis on captured imagery (Gemini or Claude) to extract colors and composition
- **Package** — Generate a structured markdown document and a branded HTML report covering 13 sections of competitive analysis

## Quick start

```bash
# 1. Clone
git clone https://github.com/curious-endeavor/visual-research.git

# 2. Copy to your Claude Code skills directory
cp -r visual-research ~/.claude/skills/visual-research

# 3. Open Claude Code and say:
#    "research Cash App"
#    "visual research on Stripe"
#    "analyze Nike's brand identity"
```

## Report sections

The HTML report includes a hero with TL;DR executive summary, then 12 sections:

```
§01  Quick Facts           §07  Assessment
§02  Positioning           §08  Strategic Verdict
§03  Brand Identity        §09  Brand Personality
§04  Brand Evolution       §10  Social Strategy
§05  Brand in Practice     §11  Campaigns
§06  Digital Experience    §12  vs [Client]
```

Plus a full-width "Signal" dark break between §03 and §04 highlighting the single most important strategic insight.

## Pipeline

```
DISCOVER ─── find agencies, campaigns, press
    │
CAPTURE ──── screenshot websites, social grids, app stores
    │
EXTRACT ──── pull images from Instagram API, YouTube, agency sites
    │
ANALYZE ──── vision analysis → colors, type, composition
    │
PACKAGE ──── markdown doc + branded HTML report
```

## Output

The skill produces two files:

1. **`[brand]-visual-research.md`** — Structured markdown with all 13 sections, suitable for feeding into other tools
2. **`[brand]-visual-research.html`** — Self-contained branded HTML report that opens in your browser

The HTML report follows the [Curious Endeavor styleguide](https://www.curiousendeavor.com/styleguide.html) — Larken headlines, Inter body text, JetBrains Mono for technical labels, #CC0000 red accent used sparingly.

See [examples/sample-report.html](examples/sample-report.html) for a full Cash App analysis.

## Customization

The report template uses CSS variables. Change the branding by editing the `:root` block in `templates/report.html`:

```css
:root {
  --red: #cc0000;        /* Accent color */
  --black: #1a1a1a;
  --grey: #666;
  --light: #999;
  --border: #eee;
  --bg: #fff;
  --max-w: 1100px;       /* Content max width */
  --font-display: 'larken', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

The CE logo is base64-embedded in the template. Replace the `<img>` src in the `.ce-bar` to use your own logo.

## Trigger phrases

Say any of these to invoke the skill:

- "research [brand]"
- "visual research on [brand]"
- "brand visual audit for [brand]"
- "analyze [brand]'s brand identity"
- "competitor visual analysis of [brand]"

## Prerequisites

**Required:** `curl` (pre-installed on macOS/Linux)

**Recommended:**

| Tool | What it unlocks | Install |
|------|----------------|---------|
| `GEMINI_API_KEY` | Vision analysis of captured images (Phase 4) | [Google AI Studio](https://aistudio.google.com/) |
| Playwright | Full-page screenshots (Phase 2) | `npx playwright install chromium` |
| yt-dlp | YouTube/TikTok thumbnails (Phase 3) | `pip3 install yt-dlp` |

The skill works without any of these — it falls back to web search and Claude's built-in vision. Each tool adds richer output.

## File structure

```
visual-research/
  SKILL.md                              # The skill (Claude reads this)
  templates/
    report.html                         # HTML report template (full-width, pill nav)
    assets/
      ce-logo-red.png                   # CE logo source (embedded as base64 in template)
  references/
    brand-audit-framework.md            # 13-section research template + HTML mapping
    source-discovery-guide.md           # Where to find brand assets
    image-extraction-techniques.md      # Instagram API, Prismic, yt-dlp recipes
    ce-styleguide.md                    # Curious Endeavor design rules
  examples/
    sample-analysis.md                  # Sample markdown output (Cash App)
    sample-report.html                  # Sample HTML report (Cash App)
```

## About

[Curious Endeavor](https://curiousendeavor.com) is a brand agency that uses agentic branding flows. This is our first open-source skill — built from the same pipeline we use for competitive research on real client work.

## License

[MIT](LICENSE)
