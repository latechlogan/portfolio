# Portfolio Site — Architecture

A personal portfolio for a **Design Engineer**. Two content surfaces (a single-page home + one internal case study), built for craft, speed, and accessibility.

**Status: v1 shipped.** All eight build phases are complete and the site is live at
[loganbaugh.com](https://loganbaugh.com). This document is no longer a build plan — it's the
reference for what exists and why, plus the backlog at the bottom. The design system below stays
LOCKED; changes to tokens, fonts, or the color rules are deliberate decisions, not drive-by edits.

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
- **Analytics:** Umami Cloud — cookie-less, no consent banner needed. Script tag lives in `BaseLayout`, gated to `import.meta.env.PROD` so dev sessions aren't tracked.
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
    Bubble.astro        # one Q or A bubble (reusable); answers carry a hidden typing overlay
    Typing.astro        # the three-dot "typing…" indicator shown before each answer
    ProjectRow.astro    # one project entry in the Projects list
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
  JonathanLoganBaugh_Resume.pdf           # resume (linked from Nav)
  media/
    provider-search-demo.mp4              # case study demo (replaced the GIF)
    provider-search-poster.jpg            # poster frame / reduced-motion still
  favicon.svg
  favicon.ico
  og-image.png
  robots.txt
astro.config.mjs        # site URL + @astrojs/sitemap
netlify.toml            # build command, publish dir, pinned NODE_VERSION
.nvmrc                  # 22.12.0 — CI reads this via node-version-file
.github/workflows/ci.yml # npm ci -> astro check -> astro build on PR + push to main
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
  --text-muted:    #767162;  /* AA on --bg (4.59:1) */
  --border:        #E7E2D8;

  /* green — signature */
  --green-ink:     #256B43;  /* FUNCTIONAL: links, focus, CTA (AA-safe) */
  --green-fill:    #6DC786;  /* DECORATIVE only: monogram, dots, hover */
  --green-tint:    #E6F4EB;  /* chip backgrounds */

  /* pops — sparing */
  --coral:         #F97648;  /* DECORATIVE only: one rare warm pop */
  --coral-tint:    color-mix(in srgb, var(--coral) 40%, transparent);  /* hero highlighter — same in both themes */
}

[data-theme="dark"] {
  --bg:            #17150F;
  --surface-1:     #201E18;
  --surface-2:     #26241D;
  --text-primary:  #F2EFE6;
  --text-secondary:#A8A398;
  --text-muted:    #86816F;  /* AA on --bg (4.68:1) */
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
- *Coral* (`--coral`, rare): a single warm pop — one hero detail or a lone accent moment. Not for text. Spent on the hero's highlighter stroke behind *make it beautiful* via `--coral-tint` (added Sept 2026; one value for both themes — the text on top carries the contrast either way).
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

  --leading-tight:  1.118; /* display — √1.25, half a step on the type ratio */
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

Line-heights follow the type ratio too: `snug` = 1.25¹, `normal` ≈ 1.25², and `tight` = √1.25 (half a step). `tight` was 1.05 until Sept 2026, when the hero's two-line serif/mono display needed room between the coral highlighter and the code chip.

Hierarchy is driven by **weight + line-height**, not size alone. Keep to two weights (400/500). The hero display is the one place drama is allowed — it's where the serif/mono tagline lives.

## Components

- **BaseLayout** — the shell. Props: `title`, `description`. Renders `Head`, `Nav`, `<slot/>`, `Footer`. Inlines a tiny theme-init script in `<head>` (set `data-theme` before paint to avoid a flash), and the Umami analytics script tag when `PROD`.
- **Head** — SEO/meta, OG tags, title template (`%s · Logan Baugh`), canonical URL.
- **Nav** — links: About, Projects, Resume, GitHub, LinkedIn + `ThemeToggle`. Below 540px it's two rows (brand + toggle, then links) via flex `order`; tab order stays brand → links → toggle, matching desktop.
- **ThemeToggle** — button toggling `[data-theme]`, persisted to `localStorage`, respects `prefers-color-scheme` on first visit.
- **Hero** — mono eyebrow "Design engineer" + the serif/mono tagline as the `h1` (`make it beautiful` = serif with a `--coral-tint` highlighter, `make it work` = mono chip on `--green-tint`) + supporting line + CTA. `h1` is `--text-2xl` below 500px (display wraps to 4–5 lines there) and `--text-display` from 500px. Headline words are split into spans at build time for the entrance; the `h1` carries an `aria-label` with the full sentence.
- **About** — the conversational thread; composes `Bubble` components; owns the scroll-reveal.
- **Bubble** — props: `variant: 'question' | 'answer'`. Question = `--surface-1`, serif italic; answer = `--surface-2`, sans, with mono chips for tech terms. Asymmetric corner per side. Answer rows also carry a `hidden` `.typing-slot` overlay (a `Typing`) pinned to the card's bottom-right corner; About's script shows it briefly before the card lands. Layout is reserved either way, so the swap causes no shift.
- **Typing** — no props. The three-dot indicator, shaped like an answer card so it reads as "Logan is typing". Only used inside answer rows; the thread deliberately ends on the last answer rather than a dangling indicator, so nothing implies more is coming.
- **ProjectRow** — props: `title`, `tagline`, `description`, `links`, `image`. One `<li>` in the Projects list: hairline divider, serif tagline, no card chrome. On hover-capable pointers ≥1280px, a decorative thumbnail (screenshot in `src/assets/projects/`) fades in on hover and chases the pointer on a spring (`position: fixed`; Motion `springValue` + `styleEffect`); everywhere else it's `display: none`, so touch devices never fetch it.
- **Footer** — "Designed and built by hand · 2026"; "built by hand" links the repo.

## Content collections (`content.config.ts`)

Astro 5 content layer. One collection now, one stubbed for later.

- **`work`** (case studies) — schema: `title`, `tagline`, `summary`, `order` (number), `draft` (boolean), optional `cover` image. `provider-directory-search.md` is the first entry.
- **`writing`** (essays) — *not built yet, scaffold-ready.* Every design engineer (Emil, Rauno, Paco) has one; add when ready.

## Pages & routing

- `index.astro` — composes Hero, About, Projects (maps `ProjectRow`s + the "Before that" note), Contact.
- `work/[slug].astro` — `getStaticPaths()` over the `work` collection; renders each case study inside `BaseLayout`.

## Motion

Use the vanilla **Motion** library (motion.dev) — framework-agnostic, tiny, no React. CSS handles the simplest states.

- **Conversation choreography** — About's thread plays like a chat. Motion's `inView()` marks each row ready as it crosses a spatial threshold (`-12%` viewport margin); a small sequencer then releases rows strictly in document order: a question pops in (spring), then the answer's typing dots appear for a beat scaled to the answer's length (400–1000ms), then the dots fade and the card lands. Rows the reader jumped past without them ever entering the viewport are shown plainly, so the thread reads whole on the way back up. **Why a sequencer:** Chrome delivers IntersectionObserver callbacks in no particular order, so "play on callback" let answers land before their questions. `animate` comes from `motion/mini`; `inView`/`spring` from `motion` (mini doesn't export them).
- **Hero entrance** — CSS keyframes, not Motion: the hero is above the fold, and a deferred script would paint the content before hiding it. Eyebrow → headline word by word (60ms apart, overshoot curve standing in for a spring) → coral highlighter sweeps in (`background-size`) → support → CTA, ~1.5s total. `animation-fill-mode: backwards` so finished animations don't override the CTA's `:active` nudge.
- **Typing indicator** — CSS keyframes on the dots (`Typing.astro`).
- **Project thumbnails** — chase the pointer on a slightly underdamped spring (`springValue`, stiffness 300 / damping 20 / mass 0.5): a touch of lag and a ~3px overshoot. Jumps to the pointer on entry so it never flies in; reduced motion always jumps. CSS owns show/hide (opacity) and the offset from the cursor (`translate`). The Projects section uses `cursor: default` so the pointer doesn't flicker to an I-beam over text; links keep the hand.
- **Hover / press / focus states** — pure CSS transitions. Links rest on a 40% underline that fills to full on hover; the theme toggle squashes slightly on press; in-page anchors scroll smoothly.
- **`prefers-reduced-motion: reduce`** — gate all motion; content appears instantly.

**Islands:** none. Nothing here requires framework-level reactivity, and vanilla Motion covers animation. The "ship pure HTML/CSS" principle is a *default, not a ban* — but adding a UI framework is a decision to make deliberately, against a specific piece that needs it, not a direction this build is heading.

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

## Build order — all phases complete

The original SDD-lite plan, kept as the record of how v1 came together. Each phase maps to a commit.

1. ✅ **Foundation** — scaffolded via `npm create astro@latest` (minimal template, TS strict); tokens, fonts, reset, `BaseLayout`.
2. ✅ **Chrome** — `Nav`, `Footer`, `ThemeToggle` (no-flash init + dark mode).
3. ✅ **Hero** — display headline + the serif/mono tagline motif.
4. ✅ **Home sections** — `ProjectCard`, Projects, Contact.
5. ✅ **About** — `Bubble` + the conversational thread + scroll-reveal.
6. ✅ **Case study** — `work` collection + `[slug].astro` + `provider-directory-search.md`.
7. ✅ **Polish** — SEO/OG, sitemap, `robots.txt`, accessibility pass, reduced-motion + dark-mode QA.
   - 7a: the demo GIF became a muted looping `<video>` with `controls`, a poster frame, and
     `preload="metadata"`; autoplay is JS-driven off `data-autoplay` so reduced-motion users get
     the poster and the controls instead.
   - 7b: per-bubble reveal + swapping About's `animate` import to `motion/mini` cut the JS chunk
     62K → 11.7K (4.7K gzipped).
8. ✅ **Ship** — Netlify (`netlify.toml`, Node pinned to 22.12.0), GitHub Actions CI
   (`astro check` + `astro build` on every PR and push to `main`), and a `main` branch ruleset
   requiring PRs. Live at [loganbaugh.com](https://loganbaugh.com).

Copy lives in the repo: page and component markup for the home page and 404, and
`src/content/work/` for case studies. (It started in an Obsidian vault, since retired.)

## Design passes — audited Sept 2026, in progress

A redesign audit against the live site (Sept 13, 2026) found the foundation strong and the
generic-pattern checklist mostly inapplicable: no grain, imagery, or glassmorphism — those fix
flat *generic* sites, and this one is flat on purpose. What it found instead is a short list of
places the site stops short of its own principles. Ordered by impact vs. risk; each pass is its
own reviewable PR.

1. ✅ **Alignment and feedback** — nav shares the content column; links rest on a 40% underline
   that fills on hover; press states; smooth in-page scroll. (PR #7)
2. ✅ **Hero** — tagline promoted to the `h1`, "Design engineer" demoted to a mono eyebrow;
   `--text-2xl` → `--text-display` at 500px; `--coral` spent on a highlighter via the new
   `--coral-tint`; `--leading-tight` retuned to √1.25; staggered word-by-word CSS entrance.
3. ✅ **Conversation choreography** — question → typing dots → answer, released in document
   order by a sequencer; trailing indicator removed. (PR #7)
4. ✅ **Projects** — cards replaced with an editorial list (`ProjectRow`). The planned imagery
   didn't match the projects, so Zapmath and Fox Family got fresh homepage screenshots and
   Provider Search uses its demo poster. Thumbnails follow the pointer on desktop and are text-only on
   touch, gated by `(hover: hover) and (pointer: fine)` rather than width alone.
5. ✅ **404 page** — `src/pages/404.astro`: a single static question/answer exchange reusing
   `Bubble`, under a plain "Page not found" `h1`. No typing choreography — not worth
   extracting About's sequencer for one exchange.
6. **Polish** — case study meta strip (role / stack / year, mono), ~~active-section state in the
   nav~~ (dropped — see backlog), and ✅ mobile QA at 360/390/414px — no horizontal overflow anywhere; the nav (three
   ragged rows at 390px) is now two rows below 540px: brand + toggle, then links.

## Backlog — deliberately not built

Nothing here is a gap in v1; each is a decision to revisit, not an unfinished task.

- **`writing` collection** — intentionally left as a stub. The intent is documented above, but
  nothing exists in code: no `writing` entry in `content.config.ts`, no `src/content/writing/`, no
  route. Staying stubbed until there's something worth publishing; wire up all three then.
- **Active-section state in the nav** — built and dropped (Sept 2026). The nav isn't sticky, so
  it has scrolled away by the time About or Projects is being read, and the highlight is never
  visible. The page is one short scroll with two linked sections, so there's no wayfinding
  problem to solve. Revisit only if the nav becomes sticky (desktop only — the two-row phone
  nav is too tall to pin).
