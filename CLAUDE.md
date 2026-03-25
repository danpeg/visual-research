# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Claude Code skill (`SKILL.md`) that runs a five-phase pipeline to research any brand's visual identity and produce a branded HTML report. Built by [Curious Endeavor](https://curiousendeavor.com), a brand agency using agentic branding flows.

The skill is invoked conversationally ("research Cash App", "visual research on Stripe") — there is no build step, test suite, or runtime. The repo is documentation and templates, not executable code.

## Repository Structure

- **`SKILL.md`** — The skill definition. This is what Claude reads when the skill is invoked. Contains the full pipeline spec, input format, phase definitions, image embedding procedure, and OpenClaw deployment options.
- **`templates/report.html`** — HTML report template with `{{PLACEHOLDER}}` variables and `data-slot` image positions. Full-width layout with sticky CE bar, hero block, pill-track navigation, and 12 report sections. Uses CSS custom properties for branding (`:root` block). Fonts: Larken (Adobe Fonts, headlines), Inter (Google Fonts, body), JetBrains Mono (Google Fonts, technical labels). CE logo is base64-embedded.
- **`templates/assets/ce-logo-red.png`** — CE logo source file (embedded in the template as base64).
- **`references/`** — Supporting docs the skill reads during execution:
  - `brand-audit-framework.md` — The 13-section research template
  - `source-discovery-guide.md` — Search strategies for finding brand assets
  - `image-extraction-techniques.md` — Instagram API, Prismic CMS, yt-dlp recipes
  - `ce-styleguide.md` — Curious Endeavor design rules (colors, typography, spacing, components)


## Key Concepts

**Five phases:** Discover → Capture → Extract → Analyze → Package. Each phase has specific tool requirements and fallbacks documented in `SKILL.md`.

**Template variables in `report.html`:** Uses `{{MUSTACHE}}` placeholders for content (`{{BRAND_NAME}}`, `{{TLDR_VERDICT}}`, `{{SIGNAL_HEADLINE}}`, `{{FACT_N_VALUE}}`, `{{SWATCH_N_HEX}}`, `{{EVOLUTION_N_YEARS}}`, etc.). Images use a `data-slot` system — each `<img>` has a `data-slot="N"` attribute (slots 0-18) and `data-aspect` for expected ratio. Images are base64-embedded by replacing the `src` attribute of the matching slot.

**CE Styleguide rules** (from `references/ce-styleguide.md`): White background, `#CC0000` red used sparingly (section labels only), no shadows/rounded corners, generous whitespace, light font weights for body. Hero overlay gradient is the one exception to the no-gradients rule.

**Section mapping:** The 13-section markdown research doc maps to a different order in the HTML report. Sections 04+05 merge into "Brand Identity", Section 13 is absorbed into Social/Personality, and new synthesized sections (TL;DR, Signal) are added. See `references/brand-audit-framework.md` for the full mapping table.

**OpenClaw deployment:** The skill can run locally (no timeout) or via OpenClaw sub-agents on the VPS. For OpenClaw, either increase timeout to 20min or split into Gather (phases 1-4) and Package (phase 5) agents.

## When Editing

- Changes to the pipeline logic go in `SKILL.md`
- Changes to report appearance go in `templates/report.html` and `references/ce-styleguide.md`
- Changes to research methodology go in the relevant `references/` file
- **After any change, reinstall the skill** by running (from the repo root): `cp -r ./* ~/.claude/skills/visual-research/`
