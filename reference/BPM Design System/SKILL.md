---
name: bpm-design
description: Use this skill to generate well-branded interfaces and assets for BPM, the real-estate portfolio intelligence platform for multi-asset holders. Contains essential design guidelines, colors, type, fonts, logos, slide templates, and UI kit components for prototyping bilingual (Traditional Chinese / English) institutional finance UI in the spirit of Bain, BlackRock, and Goldman.
user-invocable: true
---

# BPM Design System

Read **`README.md`** first — it sets the brand context, content rules, visual foundations, and iconography.

Then look at:

- `colors_and_type.css` — all design tokens (colors, type, spacing, radii, shadows, motion). Import this at the top of any HTML you create for BPM.
- `assets/` — logos (wordmark, monogram, report stamp), bilingual lockups. Copy these out into your artefact; never re-draw them.
- `preview/` — small reference cards that document each token cluster (colors, type, spacing, components). Treat these as the canonical look-and-feel of every concept.
- `ui_kits/web_app/` — React/JSX recreation of the BPM Intelligence dashboard (TopBar, Sidebar, KPIStrip, AssetTable, PortfolioMap, AssetDetailDrawer, Composer). Lift component patterns from here.
- `ui_kits/marketing/` — React/JSX recreation of the public marketing site (NavBar, Hero, CapabilityGrid, StatStrip, Coverage, Footer).
- `slides/` — eight 1280 × 720 slide templates (Title, Agenda, Section divider, Big number, Comparison, Data table, Pull quote, Closing asks).

## Working rules

1. **One red per screen.** `--bpm-red` (`#8E1B1F`) is the house identity *and* the loss colour — never split the role.
2. **Traditional Chinese leads.** Stack 繁中 over English at 70% size in `--ink-3` when bilingual.
3. **No serif.** The entire system is Inter 400/500/600/700/800 + Noto Sans TC 400/500/600/700 — no serif body, no serif display, ever.
4. **Numerals are tabular.** Apply `font-variant-numeric: tabular-nums lining-nums` to anything that appears in a column or stacks vertically.
5. **The hairline is the card.** Cards are 1 px borders, no shadow. Reserve shadows for menus and modals.
6. **Sentence case** for English. Never Title Case. Never ALL CAPS except 11 px small-caps eyebrow labels.
7. **No emoji.** Ever. In product, marketing, or decks.

## If creating visual artefacts (decks, mocks, throwaway prototypes)

Copy the assets you need (`assets/bpm-wordmark-red.svg`, `assets/bpm-monogram.svg`, etc.) into the project and create a static HTML file at design dimensions (1280 × 720 for slides; 1440 wide for product). Pull `colors_and_type.css` in with a `<link>`. Lift component markup from `ui_kits/` or `slides/`.

## If working on production code

Read `colors_and_type.css` and import its tokens into your own design-tokens layer. Read the component patterns in `ui_kits/` as references for spacing, hierarchy, and density — these are intentionally simple, mainly-cosmetic implementations, not production code.

## If invoked without guidance

Ask the user what they want to build — a slide, a screen, a marketing page, a one-off graphic — and which audience and language (TW / EN / both). Then act as an expert BPM designer and produce HTML artefacts or production code as appropriate.
