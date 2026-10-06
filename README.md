# Origemite Archive

> **개요:** Origemite Archive 저장소 안내. Engineering Archive + Harness + Templates 구조와 로컬 실행 방법.

Personal **Engineering Archive** built on Docusaurus.

It stores engineering knowledge, architecture, decisions, patterns, and implementation references in **Markdown and Git**. The same assets are meant to be consumed by humans (this site) and by AI coding agents (via `docs/harness/`, `index/`, and `docs/harness/templates/`).

This is not a daily blog. Repository name: `docusaurus-archive`. Intended site: `archive.origemite.com`.

## What is Origemite Archive?

| Concern | Location |
|---------|----------|
| Engineering knowledge & ADRs | `docs/` |
| Portable AI harness | `docs/harness/` |
| Implementation templates | `docs/harness/templates/` |
| Asset map (“what is where?”) | `index/` |
| Agent bootstrap | `AGENTS.md` |
| Human browsing UI | Docusaurus (`src/`, `docusaurus.config.ts`) |

**Write once, consume by humans and AI.**

## Repository structure

```text
docs/           Engineering archive (knowledge, architecture, patterns, …)
docs/harness/        Entrypoints, agents, context, workflows, profiles, bundles
docs/harness/templates/      Reusable implementation reference assets
index/          Engineering asset index / context map
AGENTS.md       Agent router (not a giant prompt)
src/            Site UI (homepage, about, theme)
```

## Local development

Toolchain: Node via `mise.toml` (`node = "22"`). Package manager: **npm**.

```bash
mise install          # if needed
npm install
npm run start         # local dev server
npm run build         # production build → build/
npm run typecheck     # TypeScript check
npm run serve         # serve the production build
```

## Engineering Archive

Browse from `/docs/`. Areas:

- **Knowledge** — current how-we-build notes (concept vs technology separated)
- **Architecture** — system design
- **Patterns** — reusable patterns
- **Decisions** — ADRs
- **Experiments / Postmortems / History** — non-default context; promote or consult as needed

Markdown should remain useful without Docusaurus.

## Harness

See [`docs/harness/index.md`](./docs/harness/index.md) and root [`AGENTS.md`](./AGENTS.md).

Agents should **not** load the entire archive. Prefer Index → selected docs → docs/harness/templates/ADRs → history only when necessary.

## Templates

See [`docs/harness/templates/README.md`](./docs/harness/templates/README.md). Knowledge explains responsibility; templates show concrete code shape.

## Writing conventions

- Prefer small Markdown units an agent can include or exclude independently
- Use light YAML frontmatter (`id`, `title`, `description`, `tags`, `status`) where useful
- Link related docs that exist; do not invent large fake trees
- Keep personal coding rules out of the archive until they are real — use TODO/skeleton
- Docusaurus `_category_.json` is navigation only; it must not define engineering meaning
