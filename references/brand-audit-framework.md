# Brand Audit Framework

The 13-section visual research document template. This is the intermediate markdown format — sections map to the HTML report in a different order (see mapping below).

## Document Structure

```markdown
# [Brand] — Visual Research

## Brand Config
- Website: [url]
- Instagram: @[handle] ([followers] followers, [posts] posts)
- TikTok: @[handle] ([followers] followers)
- YouTube: @[handle] ([subscribers] subscribers)
- X: @[handle]
- LinkedIn: [page]
- Primary Agency: [name]
- Recent Campaigns: [list]
```

## Sections

### 01 — Quick Facts
Revenue, monthly active users, growth rate, year founded, HQ location. Include date stamps on all financial data.

### 02 — Positioning
Market position, mission statement, recent strategic pivots. How the brand describes itself vs. how the market perceives it.

### 03 — Brand Evolution
Timeline of significant brand moments: launches, rebrands, agency changes, visual identity shifts, major campaigns. Chronological order.

### 04 — Color Palette
Hex values extracted from:
- CSS variables on the brand's website (`getComputedStyle`, stylesheet inspection)
- Vision analysis of captured screenshots and campaign imagery
- App store screenshots and marketing materials

Document primary, secondary, and accent colors. Note usage patterns (e.g., "Green only appears on CTAs, never as background fill").

### 06 — Layout & UX
- Information density (low/medium/high)
- Navigation patterns (tab bar, hamburger, sidebar)
- Key interaction patterns (swipe, tap, scroll)
- Screen composition (single-action vs. multi-panel)
- Responsive behavior

### 07 — Assessment
Strengths and weaknesses rated on a relative scale. Categories:
- Cultural Relevance
- Brand Recognition
- Visual Consistency
- Target Demo Penetration
- Product Simplicity
- Trust / Safety Perception
- International Presence
- Demographic Breadth

### 09 — Brand Personality
- Archetype (Rebel, Creator, Sage, etc.)
- Voice characteristics (3-5 adjectives with examples)
- Audience signal (what using this brand says about the user)
- Tone samples (2-3 actual copy examples from the brand)

### 11 — Social Strategy
Platform-by-platform breakdown:
- Follower count
- Posting frequency
- Content pillars
- Tone variation across platforms
- Top-performing formats
- Engagement rate (if observable)

### 12 — Content & Campaign
Hero campaigns with:
- Campaign name
- Agency
- Year
- Media mix (TV, OOH, Digital, Social, etc.)
- Key talent
- Visual language description
- Cultural impact assessment

### 13 — Audience & Community
- Demographics (age, gender, geography)
- Sentiment analysis (positive/negative themes)
- UGC patterns
- Community management style
- Key community touchpoints (subreddits, Discord, forums)

## HTML Report Mapping

During Phase 5 (Package), the 13 markdown sections map to the HTML report as follows. The HTML report also adds synthesized sections (TL;DR, Signal) not present in the research doc.

| HTML report section | Source from research doc |
|---|---|
| Hero + TL;DR | Synthesized from all sections |
| §01 Quick Facts | Section 01 |
| §02 Positioning | Section 02 |
| §03 Brand Identity | Section 04 (Color) + Logo |
| Dark Break / Signal | Synthesized — single most important insight |
| §04 Brand Evolution | Section 03 |
| §05 Brand in Practice | Curated images from captures |
| §06 Digital Experience | Section 06 |
| §07 Assessment | Section 07 |
| §09 Brand Personality | Section 09 + Section 13 audience data |
| §10 Social Strategy | Section 11 + Section 13 community data |
| §11 Campaigns | Section 12 |

## Image Inventory

Append to the research doc:

```markdown
## Image Inventory
| # | Source | File | Slot | Use |
|---|--------|------|------|-----|
| 1 | Agency (Name) | agency-01.jpg | 0 | Hero image |
| 2 | Instagram API | ig-post-01.jpg | 3 | Brand in Practice grid |
| 3 | Playwright | website-homepage.png | 9 | Digital Experience |
```

Map each image to its `data-slot` position in the HTML report template (slots 0-17).
