# Portfolio Site — Architecture

A personal portfolio for a **Design Engineer**. Two content surfaces (a single-page home + one internal case study), built for craft, speed, and accessibility. Drop this in the repo root as `ARCHITECTURE.md` (or fold into `CLAUDE.md`).

## Principles

- **Restraint is the flex.** Clean, fast, accessible foundation; a few high-craft moments (serif/mono motif, the conversational About, subtle motion, sparing color pops).
- **Ship pure HTML/CSS.** Zero client JS by default; opt into JS only where an interaction needs it.
- **The site is the audition.** How it's built and how it feels *is* the portfolio.

## Stack

- **Astro 5** (static output) — no React, no UI framework runtime.
- **Hand-written CSS** with custom properties (design tokens) + Astro scoped styles. No Tailwind — the hand-crafted CSS is itself a design-engineer signal and keeps the serif/mono system legible.
- **Vanilla JS** in `<script>` tags for the two interactive bits (theme toggle, scroll-reveal). No islands (see below).
- **Motion:** the vanilla **Motion** library (motion.dev) — framework-agnostic, tiny.
- **Fonts self-hosted** via Fontsource (no external font requests — faster + privacy-clean).
- **Deploy:** Netlify (static), same pipeline as Fox Family — GitHub -> Netlify, deploy previews as staging, branch protection on `main`.

## Folder structure

```
src/
  components/
    Head.astro          # <meta>, OG, title template, canonical
    Nav.astro           # nav links + ThemeToggle
    Footer.astro        # "Designed and built by hand" -> repo link
    ThemeToggle.astro   # dark/light button (localStorage-backed)
    Hero.astro          # headline + serif/mono tagline + CTA
    About.astro         # the conversational thread
    Bubble.astro        # one Q or A bubble (reusable)
    ProjectCard.astro   # one project entry (external or internal link)
  layouts/
    BaseLayout.astro    # html shell: Head, Nav, <slot/>, Footer, theme init
  content/
    work/
      provider-directory-search.md
  pages/
    index.astro         # home: Hero + About + Projects + Contact
    work/
      [slug].astro      # renders case studies from the work collection
  styles/
    tokens.css          # design tokens (color, type, space) + dark mode
    global.css          # reset + base element styles; imports tokens
  assets/
    projects/           # project images (optimized via astro:assets <Image/>)
  content.config.ts     # content collection schemas (Astro 5 content layer)
public/
  Baugh_Resume.pdf
  Baugh_Portfolio.pdf   # visual design PDF
  favicon.svg
  og-image.png
```

## Design system — LOCKED

### Fonts
- `--font-sans`: **Geist** — body/UI.
- `--font-serif`: **Instrument Serif** — the "voice" (About questions, "make it beautiful").
- `--font-mono`: **Geist Mono** — code chips, "make it work", tech terms.

Install: `@fontsource-variable/geist`, `@fontsource/instrument-serif`, `@fontsource-variable/geist-mono`.

### Color — warm neutral foundation + green signature

Direction: ~90% warm-neutral foundation with small, sparing color pops. Green is the signature. **Accessibility split:** the bright green fails text contrast, so it is decorative-only; a deep green carries anything functional (links/focus/CTA). Same rule for coral (decorative pop only).

```css
:root {
  /* foundation — warm neutrals */
  --bg:            #FAF8F3;
  --surface-1:     #F1EEE6;  /* recessed — About question bubbles */
  --surface-2:     #FFFFFF;  /* cards — About answer bubbles */
  --text-primary:  #1C1A17;
  --text-secondary:#57534C;
  --text-muted:    #8A857B;
  --border:        #E7E2D8;

  /* green — signature */
  --green-ink:     #256B43;  /* FUNCTIONAL: links, focus, CTA (AA-safe) */
  --green-fill:    #6DC786;  /* DECORATIVE only: monogram, dots, hover */
  --green-tint:    #E6F4EB;  /* chip backgrounds */

  /* pops — sparing */
  --coral:         #F97648;  /* DECORATIVE only: one rare warm pop */
}

[data-theme="dark"] {
  --bg:            #17150F;
  --surface-1:     #201E18;
  --surface-2:     #26241D;
  --text-primary:  #F2EFE6;
  --text-secondary:#A8A398;
  --text-muted:    #746F63;
  --border:        #302D25;

  --green-ink:     #7FD497;  /* functional on dark (lighter for contrast) */
  --green-fill:    #6DC786;
  --green-tint:    #1E2A20;

  --coral:         #F97648;
}
```

**Accent application map**
- *Functional* (`--green-ink`, consistent for a11y): links, CTA, focus rings, active nav, text selection.
- *Decorative* (`--green-fill`, sparing): the "LB" monogram, typing-indicator dots, small section markers, project-card hover wash.
- *Chips* (`--green-tint`): background of the mono "make it work" chips / tech terms.
- *Coral* (`--coral`, rare): a single warm pop — one hero detail or a lone accent moment. Not for text.
- *Tone-on-tone:* recessed `--surface-1` (question bubbles) vs. white `--surface-2` (answer cards) — quiet two-tinted-neutral contrast, no extra color.

Verify all accent-on-surface pairs at WCAG AA in **both** themes before shipping.

### Type — restrained scale + one off-scale display

Mirrors Stripe/Linear/Vercel: a tight, weight-driven text scale for reading/UI, plus one punchy hero display that breaks the scale. Base 16px, ~major-third steps, hand-tuned display.

```css
:root {
  --text-xs:   0.8rem;    /* mono labels, chips */
  --text-sm:   0.9rem;    /* meta, secondary */
  --text-base: 1rem;      /* body */
  --text-lg:   1.25rem;   /* lead / large body */
  --text-xl:   1.563rem;  /* section headings */
  --text-2xl:  1.953rem;  /* larger headings */
  --text-display: clamp(2.75rem, 6vw, 4rem); /* hero — off-scale */

  --leading-tight:  1.05;  /* display */
  --leading-snug:   1.25;  /* headings */
  --leading-normal: 1.6;   /* body */
  --tracking-tight: -0.02em; /* display + large headings */

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

  --radius: 8px;
  --radius-bubble: 16px;
  --measure: 64ch; /* max line length */
}
```

Hierarchy is driven by **weight + line-height**, not size alone. Keep to two weights (400/500). The hero display is the one place drama is allowed — it's where the serif/mono tagline lives.

## Components

- **BaseLayout** — the shell. Props: `title`, `description`. Renders `Head`, `Nav`, `<slot/>`, `Footer`. Inlines a tiny theme-init script in `<head>` (set `data-theme` before paint to avoid a flash).
- **Head** — SEO/meta, OG tags, title template (`%s · Logan Baugh`), canonical URL.
- **Nav** — links: About, Projects, Resume, Visual Design, GitHub, LinkedIn + `ThemeToggle`.
- **ThemeToggle** — button toggling `[data-theme]`, persisted to `localStorage`, respects `prefers-color-scheme` on first visit.
- **Hero** — display headline "Design engineer" + serif/mono tagline (`make it beautiful` = serif span, `make it work` = mono chip on `--green-tint`) + supporting line + CTA.
- **About** — the conversational thread; composes `Bubble` components; owns the scroll-reveal.
- **Bubble** — props: `variant: 'question' | 'answer'`. Question = `--surface-1`, serif italic; answer = `--surface-2`, sans, with mono chips for tech terms. Asymmetric corner per side.
- **ProjectCard** — props: `title`, `tagline`, `href`, `external?`. External (Zapmath, Fox Family) -> live site; internal (Provider Search) -> `/work/provider-directory-search`.
- **Footer** — "Designed and built by hand · 2026"; "built by hand" links the repo.

## Content collections (`content.config.ts`)

Astro 5 content layer. One collection now, one stubbed for later.

- **`work`** (case studies) — schema: `title`, `tagline`, `summary`, `order` (number), `draft` (boolean), optional `cover` image. `provider-directory-search.md` is the first entry.
- **`writing`** (essays) — *not built yet, scaffold-ready.* Every design engineer (Emil, Rauno, Paco) has one; add when ready.

## Pages & routing

- `index.astro` — composes Hero, About, Projects (maps `ProjectCard`s + the "Before that" note), Contact.
- `work/[slug].astro` — `getStaticPaths()` over the `work` collection; renders each case study inside `BaseLayout`.

## Motion

Use the vanilla **Motion** library (motion.dev) — framework-agnostic, tiny, no React. Same project/engine as Framer Motion, so concepts transfer. CSS handles the simplest states.

- **Scroll-reveal** — Motion's `inView()` + `animate()` (spring) for About bubbles (staggered) and section entrances.
- **Typing indicator** — CSS keyframes on the dots.
- **Hover / press / focus states** — pure CSS transitions.
- **`prefers-reduced-motion: reduce`** — gate all motion; content appears instantly.

**Islands:** not needed for v1 — nothing here requires framework-level reactivity, and vanilla Motion covers animation. The "ship pure HTML/CSS" principle is a *default, not a ban.* The one thing that would justify a React island later: a deliberate interactive showcase piece (e.g., a live component playground) — which would also be the right home for **Framer Motion (React)**. Note: this build does NOT back the "Framer Motion" resume keyword; that still needs a React home (Zapmath's next phase, or a dedicated interactive piece).

## Accessibility (non-negotiable — it's the differentiator)

- Semantic HTML, correct heading order, one `<h1>` per page.
- Skip-to-content link; visible focus states on all interactive elements (use `--green-ink`).
- Color contrast meets WCAG AA in **both** themes — re-verify every accent pairing.
- All project images have meaningful `alt`; decorative images `alt=""`.
- Respect `prefers-reduced-motion`.
- Keyboard-operable theme toggle and nav.

## SEO / meta

- Per-page `title` + `description` via `Head`.
- OG image + Twitter card; canonical URLs.
- `@astrojs/sitemap` integration; `robots.txt` in `public/`.

## Suggested build order (SDD-lite phases)

1. **Foundation** — scaffold via `npm create astro@latest` (minimal template, TS strict). Add tokens, fonts, reset, `BaseLayout`. Get the design system + shell rendering before any content.
2. **Chrome** — `Nav`, `Footer`, `ThemeToggle` (incl. no-flash init + dark mode).
3. **Hero** — nail the serif/mono treatment; this sets the whole visual tone.
4. **Home sections** — `ProjectCard` + Projects section + Contact.
5. **About** — `Bubble` component + the conversational thread + scroll-reveal (Motion).
6. **Case study** — `work` collection + `[slug].astro` + port `provider-directory-search.md`.
7. **Polish** — SEO/OG, sitemap, accessibility pass, reduced-motion + dark-mode QA.
8. **Ship** — Netlify deploy + CI + branch protection.

Final copy for every section lives in the vault's `Final/` folder (`Home.md`, `Provider Directory Search.md`).
