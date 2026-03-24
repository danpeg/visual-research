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

### Navigation
- Logo: Larken in #CC0000
- Links: Inter 13px, color #666
- Gap: 28px between links
- Padding: 20px vertical
- Backdrop: rgba(255,255,255, 0.96) with blur

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
- Add gradients
- Add shadows or 3D effects
- Use heavy body text weights
- Crowd elements together
- Use stock photography
- Write marketing copy
- Add unnecessary decoration
