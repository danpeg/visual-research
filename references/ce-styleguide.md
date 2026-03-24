# Curious Endeavor Design Styleguide

Source: https://www.curiousendeavor.com/styleguide.html
Version: v1.0 — February 2026

Apply these rules strictly when generating the HTML report.

## CSS Variables

```css
:root {
  --red: #cc0000;
  --black: #1a1a1a;
  --grey: #666;
  --light: #999;
  --border: #eee;
  --bg: #fff;
  --max-w: 1100px;
  --font-display: 'larken', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --size-display: 48px;
  --size-h1: 28px;
  --size-h2: 20px;
  --size-body: 14px;
  --size-small: 12px;
  --size-label: 10px;
  --size-data: 40px;
}
```

## Typography

| Font | Source | Usage | Weights | Notes |
|------|--------|-------|---------|-------|
| Larken | Adobe Fonts | Headlines & display | 400 | Letter-spacing: -0.02em. Warm editorial serif. |
| Inter | Google Fonts | Body & UI | 300, 400, 500 | Line-height: 1.6-1.7. Clean, highly legible. |
| JetBrains Mono | Google Fonts | Technical labels, code | 400, 500 | Precise, non-clinical. |

## Color Palette

| Hex | Name | Purpose |
|-----|------|---------|
| #CC0000 | Red | Accent — use sparingly (section labels and logo only) |
| #1A1A1A | Black | Primary text (headlines) |
| #666666 | Grey | Body text |
| #999999 | Light | Tertiary text, placeholders |
| #FFFFFF | White | Background |
| #FAFAFA | Off-white | Alternating section backgrounds |
| #EEEEEE | Border | Dividers, card borders |
| #D4A574 | Gold | Optional accent |

## Spacing Scale

| Size | Usage |
|------|-------|
| 8px | Tight gaps |
| 16px | Default spacing |
| 24px | Comfortable gaps |
| 48px | Section gaps |
| 80px | Large section padding |
| 120px | Maximum section padding |

## Component Specifications

### Section Labels
- Font: JetBrains Mono
- Size: 11px
- Transform: uppercase
- Letter-spacing: 0.1em
- Color: #CC0000
- Weight: 500

### Buttons
- **Primary:** Black background, white text, 14px vertical / 28px horizontal padding
- **Secondary:** Transparent with black 1px border
- **Both:** 12px uppercase, 0.08em letter-spacing, weight 500

### Cards
- Border: 1px #EEE
- Padding: 28px vertical / 20px horizontal
- Hover: border darkens to #999
- No rounded corners, no shadows

### Navigation (Pill Track)
- Sticky bar at top with CE logo image (140px wide)
- Horizontal pill-track navigation below hero, center-aligned
- Pills: 12px, weight 500, color #999, padding 6px 12px
- Active pill: white text on black background
- Scrollspy-driven — pills auto-highlight as user scrolls
- Pill track scrolls horizontally on narrow screens

### Hero Block
- Full-width, 480px height, black background
- Image with `object-fit: cover`
- Gradient overlay: transparent → rgba(0,0,0,0.85) bottom
- Title: Larken 48px white, section label in red above
- Metadata row: 12px, rgba(255,255,255,0.4)

### Dark Break (Signal)
- Full-width black background, 48px vertical padding
- Section label in red, headline in Larken white
- Body text rgba(255,255,255,0.6)
- Callout has rgba(255,255,255,0.05) background

### Accordion Sections
- 1px border, 16px/20px padding on header
- Hover: #fafafa background
- Toggle icon: `+` that rotates 45° when open
- Body hidden by default, shown when `.open` class added

### Campaign Cards
- Hero image: full-width, 420px height, `object-fit: cover`
- Meta row: label size, uppercase, light color, flex with 24px gap
- Title: Larken 20px
- Supporting images: 3-column grid, 16:9 aspect ratio, 2px gap

### Facts Grid
- 4-column grid, 1px gap with border background
- Cell: 20px padding, mono value at 20px, label at 10px uppercase

### Platform Grid
- 5-column grid, 1px gap with border background
- Cell: 20px padding, centered, icon/value/detail stack

## Logo

- Typeface: Larken in #CC0000
- Minimum height: 16px
- Clear space: height of the period character on all sides
- On dark backgrounds: use text-only version in white

## Do

- Use generous whitespace
- Keep headlines short
- Use red sparingly (labels only)
- Use light font weights for body (300)
- Apply subtle 1px borders (#EEE)
- Keep navigation minimal
- Prioritize showing work

## Don't

- Overuse the red accent
- Add gradients (exception: hero overlay gradient is structural, not decorative)
- Use heavy body text weights
- Crowd elements together
- Use stock photography
- Write marketing copy
- Add unnecessary decoration
