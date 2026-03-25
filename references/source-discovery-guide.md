# Source Discovery Guide

Detailed search strategies for finding brand assets, agency work, and campaign imagery.

## Agency Identification

Search for the brand's agency relationships:

```
web_search "[Brand] rebrand agency case study"
web_search "[Brand] brand identity agency"
web_search "[Brand] advertising agency 2024 2025 2026"
```

Check these major agency portfolio sites directly:
- Anomaly, Collins, Pentagram, Wolff Olins, Porto Rocha, Koto, DixonBaxi
- Character, R/GA, Droga5, Wieden+Kennedy, TBWA, pgLang
- Mother, Huge, FutureBrand, Landor, Interbrand, MetaDesign

## Campaign Discovery

```
web_search "[Brand] campaign [Year] case study"
web_search "[Brand] [Agency] behance"
web_search "[Brand] campaign ads of the world"
web_search "[Brand] creative campaign the drum"
web_search "[Brand] campaign little black book LBB"
```

### Priority Sources for Campaign Imagery

Ranked by image quality and availability:

1. **Behance** — Agencies post full campaign breakdowns with hero images. Search `behance.net/search/projects?search=[brand]`
2. **Brand New (Under Consideration)** — The #1 source for rebrand case studies with before/after imagery and brand evolution visuals. Older archive images can reach 2000×1125+. Some newer articles are paywalled.
   ```
   web_search "site:underconsideration.com/brandnew [Brand]"
   ```
3. **It's Nice That / Creative Review** — Editorial with agency-supplied high-res imagery
4. **LBB Online** — Campaign launches with stills and credits
5. **Ads of the World** — Archived campaign creative with full credits
6. **The Drum / Campaign / AdAge** — Trade press with campaign imagery
7. **Agency websites directly** — Case study pages, often the highest resolution source

### Digital Design Award Sites

Award sites showcase brand websites with high-quality project screenshots:

1. **Awwwards** — Website design showcases with project screenshots (newer projects: 1600×1200, older: 700×500). Best for Digital Experience section and supplementary brand-in-practice imagery.
   ```
   web_search "site:awwwards.com [Brand]"
   ```
2. **FWA** — Digital experience showcases: `web_search "site:thefwa.com [Brand]"`
3. **Mindsparkle Mag** — Design editorial features: `web_search "site:mindsparklemag.com [Brand]"`

## App Store Screenshots (iTunes Search API)

High-res app screenshots without authentication. Returns iPhone screenshots at 1242×2208, iPad screenshots, and 512×512 app icons. The most reliable image source tested — structured JSON, no rate limiting, zero failures.

```bash
# Get app screenshots and icon for a brand
curl -s "https://itunes.apple.com/search?term=[Brand]&entity=software&limit=3" | python3 -c "
import json, sys, os
data = json.load(sys.stdin)
os.makedirs('app-store', exist_ok=True)
for r in data['results']:
    name = r['trackName'].replace(' ', '-').lower()
    # Download icon
    icon_url = r.get('artworkUrl512', r.get('artworkUrl100', ''))
    if icon_url:
        os.system(f'curl -sL \"{icon_url}\" -o app-store/{name}-icon.jpg')
    # Download first 3 iPhone screenshots
    for i, url in enumerate(r.get('screenshotUrls', [])[:3]):
        os.system(f'curl -sL \"{url}\" -o app-store/{name}-screenshot-{i+1}.jpg')
    # Download first 2 iPad screenshots
    for i, url in enumerate(r.get('ipadScreenshotUrls', [])[:2]):
        os.system(f'curl -sL \"{url}\" -o app-store/{name}-ipad-{i+1}.jpg')
    print(f'{r[\"trackName\"]}: {len(r.get(\"screenshotUrls\",[]))} iPhone, {len(r.get(\"ipadScreenshotUrls\",[]))} iPad screenshots')
"
```

**Best for:** Digital Experience section (slot 9), app-focused brands. Screenshots are already max-res — no CDN stripping needed.

**Note:** Not every brand has an iOS app. If the API returns no results, skip this source silently.

## Brand Press Room

Many brands host downloadable press kits:

```
web_fetch "https://[brand-domain]/press"
web_fetch "https://[brand-domain]/newsroom"
web_fetch "https://[brand-domain]/media"
web_fetch "https://[brand-domain]/press-kit"
web_fetch "https://[brand-domain]/brand"
```

Press pages often have downloadable high-res logos, brand guidelines, and executive photos.

## Social Presence Discovery

```
web_search "[Brand] instagram tiktok social media presence"
```

Verify each handle:
- Exists and is public
- Is the official account (blue check, linked from website)
- Has recent activity (dormant accounts aren't useful)

Standard handle locations:
- Instagram: `instagram.com/[handle]`
- TikTok: `tiktok.com/@[handle]`
- YouTube: `youtube.com/@[handle]`
- X/Twitter: `x.com/[handle]`
- LinkedIn: `linkedin.com/company/[slug]`

## Hero Image Sources

Priority-ordered sources specifically for hero-quality imagery (slot 0 in the report). The hero sets the tone for the entire report — invest time here.

1. **Brand homepage** — Extract the actual hero image asset from page source (not just a screenshot). See `image-extraction-techniques.md` for the homepage hero extraction recipe.
2. **Press/media pages** — `/press`, `/newsroom`, `/brand-assets`. Press kits often have the highest-resolution brand imagery available.
3. **Agency case studies** — Behance, Dribbble, agency portfolio sites. These images are art-directed to showcase the brand at its best.
4. **Brand New (Under Consideration)** — Rebrand articles often lead with a high-quality hero image showing the new identity. Best for brands that have undergone a major visual refresh.
5. **Trade press** — It's Nice That, Creative Review, The Drum, Campaign. Publications receive agency-supplied high-res imagery for articles.
6. **Awwwards project pages** — Website showcases include 1600×1200 project screenshots. Good when the brand's digital presence is its strongest visual expression.
7. **Conference/event photography** — Brand's own events, keynotes, product launches. Professional event photography is typically high-res.
8. **App Store screenshots** — Via iTunes Search API. Screenshots at 1242×2208 (iPhone). Best for app-first brands.
9. **Product marketing** — Feature pages, app store landing pages. App Store/Play Store feature graphics are required to be 1024x500+.

**Social media is a last resort** — only use if none of the above yields a usable image. Instagram posts are compressed and often from phones.

## Financial Data Sources

For Quick Facts section:
- **Public companies**: SEC filings (10-K, 10-Q), earnings call transcripts
- **Private companies**: Crunchbase, PitchBook, press releases
- **App metrics**: Sensor Tower, App Annie, SimilarWeb (for traffic estimates)
- **Social metrics**: Direct from platforms (follower counts, post counts)

Always include the date of financial data. Stale numbers undermine credibility.
