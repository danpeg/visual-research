--ddress -
title: "feat: High-res image sourcing + dedicated hero image pipeline"
type: feat
status: active
date: 2026-03-25
---

# High-Res Image Sourcing + Dedicated Hero Image Pipeline

## Overview

Two improvements to the visual research skill:

1. **All images should be the highest resolution available.** Currently the skill grabs whatever image URL it finds first. It should systematically pursue the highest-quality version of every image — checking for CDN resize parameters, `srcset` alternatives, and direct asset URLs.
2. **Hero image (slot 0) gets a dedicated sourcing step.** Currently the hero is picked from whatever's already collected. It should be a deliberate, multi-source search with quality criteria — because the hero is the first thing anyone sees and sets the tone for the entire report.

## Problem Statement

From the Wiz research debrief:

- The hero was a grainy nighttime phone photo from Instagram — visually striking but low production value
- No deliberate search for hero-quality images was performed
- The image didn't represent Wiz's actual brand system (blue/pink/illustrated)
- Homepage hero images, press photos, and conference imagery were never checked
- CMS URLs (DatoCMS) had full-resolution assets that weren't pursued

This pattern will repeat for every brand unless the skill explicitly instructs otherwise.

## Proposed Solution

### Change 1: Image Resolution Maximizer (all images)

Add a resolution-upgrade procedure to Phase 3 (Extract) that runs on **every** image URL before downloading.

**Add to `SKILL.md` Phase 3, after "Core extractions":**

```markdown
#### Image Resolution Maximizer

Before downloading any image, attempt to get the highest resolution version:

1. **Strip CDN resize parameters.** Many CDNs append width/height params that downsample:
   - Contentful/Prismic: remove `?w=800` or `&w=800`, or set `?w=2000`
   - Cloudinary: change `/w_400/` to `/w_2000/` or remove transform path segments
   - Imgix: remove `?w=`, `?h=`, `?fit=` params
   - Shopify: change `_200x200` suffix to `_2000x2000` or remove it
   - WordPress: remove `-800x600` before the extension
   - General: try removing all query parameters and check if the raw URL returns a larger image

2. **Check srcset for larger versions.** When extracting from HTML:
   - Parse `srcset` attribute for the highest `w` descriptor
   - Check `data-src`, `data-full`, `data-original` attributes
   - Look for `<picture>` elements with larger `<source>` URLs

3. **Verify resolution after download.** For critical images (hero, logo, campaign heroes):
   ```bash
   file [image] | grep -oP '\d+\s*x\s*\d+'
   # or
   sips -g pixelWidth -g pixelHeight [image]  # macOS
   ```
   If width < 800px, flag as low-res and attempt alternative sources.

4. **Prefer PNG/WebP over JPEG** when both are available at the same size (lossless > lossy for brand assets).
```

**Add to `references/image-extraction-techniques.md`:**

New section "CDN Resolution Patterns" with the most common CDN URL patterns and how to extract max resolution.

### Change 2: Dedicated Hero Image Sourcing (Phase 3)

Add a new sub-phase to Phase 3 specifically for hero image sourcing, **before** general image extraction.

**Add to `SKILL.md` Phase 3, as the first extraction step (before logo, before Instagram):**

```markdown
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
   - Apply resolution maximizer to get the full-size asset
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
```

### Change 3: Update Quality Checklist

Add hero-specific checks to the Quality Checklist at the bottom of `SKILL.md`:

```markdown
- [ ] Hero image (slot 0) sourced from dedicated hero search — not just picked from Instagram batch
- [ ] Hero image resolution ≥1200px wide
- [ ] Hero image represents the brand's visual identity (not just "has the logo on it")
- [ ] Hero image is professionally produced (not a phone photo or UGC)
- [ ] All downloaded images passed through resolution maximizer (no CDN thumbnails)
```

### Change 4: Update Image Extraction Techniques Reference

Add to `references/image-extraction-techniques.md`:

```markdown
## CDN Resolution Patterns

Common CDN URL patterns and how to extract maximum resolution:

| CDN/CMS | URL pattern | How to maximize |
|---------|-------------|-----------------|
| Contentful | `images.ctfassets.net/...?w=800&h=600` | Remove `?w=` and `?h=` params, or set `w=2000` |
| Prismic | `images.prismic.io/...?w=800` | Append `&w=2000` or remove width param |
| DatoCMS | `www.datocms-assets.com/...?w=800` | Remove query params for original, or `?w=2000` |
| Sanity | `cdn.sanity.io/.../image-...?w=800` | Remove `?w=` param for full resolution |
| Cloudinary | `res.cloudinary.com/.../w_400,h_300/...` | Remove or increase transform values: `w_2000` |
| Imgix | `...imgix.net/...?w=800&fit=crop` | Remove `w=`, `h=`, `fit=` params |
| Shopify | `cdn.shopify.com/...file_200x200.jpg` | Remove dimensions: `file.jpg` or use `_2000x2000` |
| WordPress | `wp-content/.../image-800x600.jpg` | Remove `-800x600` before extension |
| Vercel/Next.js | `/_next/image?url=...&w=640&q=75` | Extract the `url` param, fetch directly |
| Webflow | `uploads-ssl.webflow.com/.../-w-800.jpg` | Remove `-w-800` or replace with larger value |
| Squarespace | `images.squarespace-cdn.com/...?format=500w` | Change `format=2500w` or remove param |

**General heuristic:** If an image URL contains numbers that look like dimensions (400, 600, 800, 1024) in the path or query string, try removing them or increasing to 2000. Worst case, you get a 404 and fall back to the original URL.

## Homepage Hero Extraction

For extracting the main hero image from any brand's homepage:

1. **Playwright screenshot** of above-the-fold (captures what the user sees)
2. **HTML source inspection** for hero image URLs:
   ```bash
   curl -sL "https://brand.com" | python3 -c "
   import sys, re
   html = sys.stdin.read()
   # Look for hero/banner containers
   hero_patterns = [
       r'class=[\"\\'][^\"\\']*(hero|banner|masthead|jumbotron|splash)[^\"\\'].*?(?:src|background-image)[=:]\\s*[\"\\']?([^\"\\')\\s]+)',
       r'<video[^>]+poster=[\"\\']([^\"\\' ]+)[\"\\']',
   ]
   for p in hero_patterns:
       for match in re.findall(p, html, re.IGNORECASE | re.DOTALL):
           print(match[-1] if isinstance(match, tuple) else match)
   "
   ```
3. **CMS API check** — if the site uses a headless CMS, the API often exposes the original upload without resizing
```

### Change 5: Update Source Discovery Guide

Add to `references/source-discovery-guide.md`:

```markdown
## Hero Image Sources

Priority-ordered sources specifically for hero-quality imagery:

1. **Brand homepage** — Extract the actual hero image asset from page source
2. **Press/media pages** — `/press`, `/newsroom`, `/brand-assets`
3. **Agency case studies** — Behance, Dribbble, agency portfolio sites
4. **Trade press** — It's Nice That, Creative Review, The Drum, Campaign
5. **Conference/event photography** — Brand's own events, keynotes, product launches
6. **Product marketing** — Feature pages, app store assets
```

## Files to Modify

| File | Change |
|------|--------|
| `SKILL.md` | Add hero sourcing sub-phase to Phase 3, add resolution maximizer procedure, update quality checklist |
| `references/image-extraction-techniques.md` | Add CDN resolution patterns section, add homepage hero extraction recipe |
| `references/source-discovery-guide.md` | Add hero image sources section |

## Acceptance Criteria

- [x] `SKILL.md` Phase 3 has "Hero Image Sourcing" as the **first** extraction step, before logo and Instagram
- [x] `SKILL.md` Phase 3 has "Image Resolution Maximizer" procedure applied to all image downloads
- [x] Hero sourcing includes 6-tier priority search (homepage → press → agency → campaign → product → social-last-resort)
- [x] Hero selection criteria defined with quality gates (≥1200px, brand-representative, professional)
- [x] Vision model comparison of top 3 hero candidates when available
- [x] CDN resolution patterns documented in `references/image-extraction-techniques.md` covering 10+ common CDNs
- [x] Homepage hero extraction recipe added to `references/image-extraction-techniques.md`
- [x] Quality checklist updated with hero-specific checks (5 new items)
- [x] Fallback behavior defined: flag low-quality hero rather than silently using it
- [x] Skill reinstalled after changes: `cp -r ... ~/.claude/skills/visual-research/`

## Technical Considerations

- **No new dependencies.** Resolution maximizer uses `sips` (macOS built-in) or `file` for dimension checking. Hero sourcing uses existing tools (Playwright, curl, web_search).
- **Time impact.** Hero sourcing adds ~2-3 minutes to Phase 3. For OpenClaw deployment, this fits within the existing Gather agent's ~8-10 min budget. May need to bump timeout to 25 min for single-agent mode.
- **Fallback chain is critical.** Not every brand will have a press kit or agency case study. The 6-tier priority order ensures we always get _something_, even if it's social media as a last resort.

## Sources

- Wiz research debrief (user-provided context in feature request)
- Current `SKILL.md` pipeline (Phase 3 Extract, Phase 5 Package)
- Current `references/image-extraction-techniques.md` (Instagram API, Prismic CMS, generic extraction)
- Current `references/source-discovery-guide.md` (agency search, campaign discovery, press rooms)
