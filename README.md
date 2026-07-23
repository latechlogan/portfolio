# loganbaugh.com

My portfolio. A design engineer's site, built the way I'd want to build yours — happiest in the
space between *make it beautiful* and `make it work`.

Live at **[loganbaugh.com](https://loganbaugh.com)**.

## The short version

- **[Astro 5](https://astro.build)**, static output. No UI framework runtime.
- **Hand-written CSS** with custom properties for the design tokens — no Tailwind. The CSS is part
  of the point.
- **Zero client JS by default.** Two exceptions: the theme toggle and the About section's
  scroll-reveal (the vanilla [Motion](https://motion.dev) library, ~4.7K gzipped).
- **Fonts self-hosted** via Fontsource — Geist, Instrument Serif, Geist Mono. No external font
  requests.
- **WCAG AA in both themes.** Semantic HTML, visible focus states, `prefers-reduced-motion`
  respected everywhere motion appears.

`ARCHITECTURE.md` has the full reasoning: the locked design system, the component inventory, and
what was deliberately left unbuilt.

## Running it

Requires Node 22.12.0 (see `.nvmrc`).

```sh
npm install
npm run dev      # localhost:4321
npm run build    # -> ./dist
npm run preview  # preview the production build
npx astro check  # type-check; CI runs this before the build
```

## Structure

```
src/
  components/   Head, Nav, Footer, ThemeToggle, Hero, About, Bubble, ProjectCard
  layouts/      BaseLayout — the html shell + pre-paint theme init
  content/      work/ — case studies (Astro content collection)
  pages/        index.astro, work/[slug].astro
  styles/       tokens.css (design tokens), global.css (reset + base)
```

## Deploying

Netlify builds from `main`; PRs get deploy previews. GitHub Actions runs `astro check` and
`astro build` on every PR and push.

---

Designed and built by hand.
