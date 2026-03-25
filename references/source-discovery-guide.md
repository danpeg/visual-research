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
2. **It's Nice That / Creative Review** — Editorial with agency-supplied high-res imagery
3. **LBB Online** — Campaign launches with stills and credits
4. **Ads of the World** — Archived campaign creative with full credits
5. **The Drum / Campaign / AdAge** — Trade press with campaign imagery
6. **Agency websites directly** — Case study pages, often the highest resolution source

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
4. **Trade press** — It's Nice That, Creative Review, The Drum, Campaign. Publications receive agency-supplied high-res imagery for articles.
5. **Conference/event photography** — Brand's own events, keynotes, product launches. Professional event photography is typically high-res.
6. **Product marketing** — Feature pages, app store assets. App Store/Play Store feature graphics are required to be 1024x500+.

**Social media is a last resort** — only use if none of the above yields a usable image. Instagram posts are compressed and often from phones.

## Financial Data Sources

For Quick Facts section:
- **Public companies**: SEC filings (10-K, 10-Q), earnings call transcripts
- **Private companies**: Crunchbase, PitchBook, press releases
- **App metrics**: Sensor Tower, App Annie, SimilarWeb (for traffic estimates)
- **Social metrics**: Direct from platforms (follower counts, post counts)

Always include the date of financial data. Stale numbers undermine credibility.
