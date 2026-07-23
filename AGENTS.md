## Project context

**v1 is shipped and live at https://loganbaugh.com.** All eight build phases in `ARCHITECTURE.md`
are complete. Work from here is maintenance and additions, not phased build-out — so scope changes
tightly and don't treat the doc as a to-do list.

- **`ARCHITECTURE.md`** — the source of truth for this build: stack decisions, the LOCKED design system (tokens, fonts, color rules), component inventory, the build record, and the backlog of things deliberately not built. Read it before any build work. The design system is LOCKED — don't add tokens, fonts, or colors without saying so explicitly.
- **Copy/content** lives in the Obsidian vault at `~/Documents/Obsidian Vaults/Portfolio Site/Final/` (`Home.md`, `Provider Directory Search.md`). The vault is the source of truth for copy — reference it, don't duplicate it into the repo.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Shipping

- CI (`.github/workflows/ci.yml`) runs `npx astro check` then `npm run build` on every PR and on
  pushes to `main`. Run both locally before pushing — a type error fails the build, not just lint.
- `main` is protected by a repo ruleset: land work through a PR, don't commit directly.
- Netlify builds from `main` and serves https://loganbaugh.com; PRs get deploy previews. Node is
  pinned to 22.12.0 in both `.nvmrc` and `netlify.toml` — bump them together.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
