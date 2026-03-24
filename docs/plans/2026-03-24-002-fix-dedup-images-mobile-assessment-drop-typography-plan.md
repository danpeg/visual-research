---
title: "fix: Deduplicate images, fix mobile assessment, drop typography"
type: fix
status: completed
date: 2026-03-24
---

# fix: Deduplicate Images, Fix Mobile Assessment Layout, Drop Typography

## Overview

Three focused improvements to the visual research skill: (1) prevent the same image from appearing in multiple report slots, (2) make the assessment table readable on mobile by combining columns, (3) remove typography research and display entirely.

## Problem Statement / Motivation

**Duplicate images:** Reports frequently reuse the same image across multiple slots. In the Nike report, only ~6 unique images fill 19 slots. The Prada report shows the same image in both the header and campaigns section. Root cause: during Phase 5 packaging, the LLM loses track of which images it has already assigned — especially when filling 19 slots from a pool of 8-12 captured images.

**Mobile assessment:** The assessment section is a 3-column HTML table (Dimension | Rating | Notes). On mobile it simply becomes horizontally scrollable via `overflow-x: auto` — the only section in the entire report without a proper responsive rewrite. Three narrow columns are hard to read.

**Typography:** The typography section adds research overhead without proportional value. Drop it from the pipeline entirely.

## Proposed Solution

### 1. Image Deduplication (SKILL.md)

Add a two-layer enforcement system to the Phase 5b image embedding procedure:

**Layer 1 — Tracking:** Before the embedding steps, add an instruction:
> "Maintain an Image Assignment Log as you work. Before assigning any image to a slot, check if that image filename/URL already appears in the log. If it does, skip it and choose a different unused image. If no unused images remain, leave the slot with its placeholder."

**Layer 2 — Validation:** After all slots are assigned, add a verification step:
> "Review the Image Assignment Log. If any image appears more than once, replace the duplicate occurrence with an unused image or revert it to the placeholder. It is better to leave a slot empty than to show a duplicate."

Also add to the Quality Checklist at the end of SKILL.md:
> "No image file assigned to more than one data-slot"

### 2. Mobile Assessment Layout (templates/report.html)

**Approach:** CSS-only solution at the 600px breakpoint. No HTML structure change needed.

Add `data-rating` attribute to each Dimension `<td>` in the `{{ASSESSMENT_ROWS}}` generation instructions. Then at the 600px breakpoint:

```css
@media (max-width: 600px) {
  .assessment-table th:nth-child(2),
  .assessment-table td:nth-child(2) { display: none; }

  .assessment-table td:first-child::after {
    content: " — " attr(data-rating);
    font-weight: 600;
  }
}
```

This hides the Rating column and appends the rating inline after the dimension name (e.g., "Cultural Relevance — Exceptional"), collapsing to a 2-column layout.

**Breakpoint rationale:** 600px matches where other significant layout changes happen in the template. At 900px the 3-column table is still usable on tablets.

### 3. Drop Typography (4 files)

**A. `references/brand-audit-framework.md`** — Remove Section 05 (Typography) entirely. Update the HTML mapping table to remove the typography reference from the Brand Identity merge.

**B. `templates/report.html`:**
- Remove the Typography `<h3>`, the slot-3 `<img>`, and the `.type-meta` block (`{{TYPE_PRIMARY}}`, `{{TYPE_SECONDARY}}`, `{{TYPE_CHARACTER}}`)
- Remove the `.type-meta` CSS rule (dead code after removal)
- Change `.brand-book-grid` from `grid-template-columns: 1fr 1fr` to `grid-template-columns: 1fr` — Logo becomes full-width. Color Palette remains below as-is.
- Renumber slots: slots 4-18 become slots 3-17. Total slots: 18 (0-17). Clean sequence, no gaps.
- Update `examples/sample-report.html` to match

**C. `SKILL.md`:**
- Remove "typography style and weight" from the Phase 4 vision prompt
- Remove `"fonts -> Typography section"` from Phase 4 output routing
- Update Phase 5 section mapping: Brand Identity = Logo + Color only
- Update slot table: remove old slot 3, renumber 4-18 to 3-17. New total: 18 slots (0-17)
- Remove "typography choices" from the description/trigger text
- Update image slot count references

**D. `references/ce-styleguide.md`** — No changes needed. It documents the report's own fonts (Larken, Inter, JetBrains Mono), not the researched brand's typography.

## Technical Considerations

- **Slot renumbering cascades:** Every `data-slot` attribute from 4-18 in report.html must be decremented by 1. The SKILL.md slot table must match. The sample report must match. Do this in the same change as the typography removal.
- **Assessment HTML stays unchanged:** The CSS-only approach means `{{ASSESSMENT_ROWS}}` continues to generate standard 3-column `<tr>` rows. The only addition is a `data-rating` attribute on the Dimension `<td>`.
- **Deduplication is an instruction, not code:** Since SKILL.md is read by an LLM, enforcement relies on clear, prominent instructions. The two-layer approach (track + validate) maximizes reliability.

## Acceptance Criteria

- [ ] No image appears in more than one `data-slot` in any generated report
- [ ] SKILL.md contains explicit deduplication tracking + validation instructions in Phase 5b
- [ ] Quality Checklist includes image uniqueness check
- [ ] Assessment table shows 2 columns on viewports <= 600px ("Dimension — Rating" + "Notes")
- [ ] Assessment table retains 3 columns on viewports > 600px (no regression)
- [ ] `{{ASSESSMENT_ROWS}}` instruction in SKILL.md includes `data-rating` attribute guidance
- [ ] No typography section in `brand-audit-framework.md`
- [ ] No typography HTML, CSS, or template variables in `report.html`
- [ ] No typography references in SKILL.md Phase 4 prompts, output routing, or section mapping
- [ ] Slot numbering is clean 0-17 (18 total) with no gaps
- [ ] `examples/sample-report.html` updated to reflect new slot numbering and no typography
- [ ] Full grep for "typography", "TYPE_PRIMARY", "TYPE_SECONDARY", "TYPE_CHARACTER", "type-meta", "slot=\"3\"" across repo confirms no orphaned references

## Files Changed

| File | Changes |
|------|---------|
| `SKILL.md` | Add dedup instructions (Phase 5b), add quality checklist item, remove typography from Phase 4 + section mapping, renumber slots, update description, add `data-rating` guidance for assessment rows |
| `templates/report.html` | Remove typography HTML + CSS + template vars, change brand-book-grid to 1fr, renumber data-slots 4-18 to 3-17, add mobile assessment CSS at 600px breakpoint |
| `references/brand-audit-framework.md` | Remove Section 05, update HTML mapping table |
| `examples/sample-report.html` | Update to match template changes (slot renumbering, typography removal) |

## Sources & References

- Existing reports showing duplicate images: `nike/nike-visual-research.html`, `cashapp/cashapp-visual-research.html`, `ikea/ikea-visual-research.html`
- Assessment table CSS: `templates/report.html:133-138` (base), `:197` (900px breakpoint), `:249-251` (600px breakpoint)
- Typography in template: `templates/report.html:419-428`
- Brand-book-grid: `templates/report.html:86`
- Slot table: `SKILL.md:202-213`
- Phase 4 vision prompt: `SKILL.md:144`
- Phase 4 output routing: `SKILL.md:150`
