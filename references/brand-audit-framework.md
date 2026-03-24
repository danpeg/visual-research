# Brand Audit Framework

The 13-section visual research document template. Each section maps to a corresponding section in the HTML report.

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
- Client: [your client name for comparison]
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

### 05 — Typography
Font families identified from:
- CSS `font-family` declarations on the website
- Vision analysis of marketing materials
- App store screenshots

Document: typeface names, weights used, where each is applied (headlines vs. body vs. UI), letter-spacing and line-height patterns.

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

### 08 — Strategic Verdict
For each brand element, classify as:
- **Borrow** — Element worth adapting for the client
- **Reject** — Element that wouldn't work for the client (explain why)
- **Watch** — Element to monitor for future competitive overlap

Include rationale for each classification.

### 09 — Brand Personality
- Archetype (Rebel, Creator, Sage, etc.)
- Voice characteristics (3-5 adjectives with examples)
- Audience signal (what using this brand says about the user)
- Tone samples (2-3 actual copy examples from the brand)

### 10 — vs [Client]
Head-to-head comparison table:
- Primary Color
- Typography
- Tone of Voice
- Target Demographic
- Brand Personality
- Visual Density
- Cultural Strategy
- Social Platform Strength

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

## Image Inventory

Append to the research doc:

```markdown
## Image Inventory
| # | Source | File | Use |
|---|--------|------|-----|
| 1 | Agency (Name) | agency-01.jpg | Hero image |
| 2 | Instagram API | ig-post-01.jpg | Social section |
| 3 | Playwright | website-homepage.png | Positioning section |
```

Map each image to the report section where it will appear.
