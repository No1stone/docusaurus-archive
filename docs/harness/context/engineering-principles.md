# Engineering Principles

> **개요:** 이 아카이브와 하네스가 우선하는 원칙 네 가지. 각각 왜 필요한지, 어기면 무엇이 깨지는지, 아카이브 어디에 반영돼 있는지.

High-level principles for this harness. They are few on purpose; each one shows up somewhere concrete in the repository.

## 1. Write once, consume by humans and AI

One Markdown/Git source of truth, read by people through Docusaurus and by agents through `index/` and `docs/harness/`.

**Why.** Explaining the same conventions in a chat prompt, a README, a wiki page, and a rules file guarantees that they drift. If the agent reads the page the human reads, there is only one thing to keep correct.

**If violated.** A "prompt version" of a rule starts to differ from the documented one; the agent follows the prompt, the reviewer follows the doc, and every disagreement becomes a debate about which is real.

**Where it lives.** [ADR-0001](/docs/decisions/adr-0001), the `AGENTS.md` router, every `> **개요:**` line that makes a page skimmable for both audiences.

## 2. Separate concept, technology, pattern, architecture, and decision

A Controller *concept* page says what belongs at the HTTP edge. A Spring MVC *technology* note says how annotations work. Outbox is a *pattern*; event-driven is an *architecture*; "why Kafka + Outbox here" is a *decision*.

**Why.** Frameworks change faster than responsibilities. When the two are written together, replacing the framework forces a rewrite of the thinking. Kept apart, the concept page survives and only the technology note is swapped.

**If violated.** Knowledge pages fill with version-specific snippets; the archive becomes a tutorial collection that is wrong the moment a major version ships, and the agent cannot tell a rule from an example.

**Where it lives.** The folder split under `docs/` (Knowledge / Architecture / Patterns / Decisions), the separation table on the [Patterns](/docs/patterns/) index, and the Knowledge ↔ Template pairing rule ("Knowledge explains responsibility; templates show concrete code shape").

## 3. Progressive context loading

Never hand an agent the whole archive. Index → selected orchestration → only the knowledge and templates that recipe lists.

**Why.** Context is a budget. Everything loaded that is not needed crowds out what is, makes the model average between conflicting examples, and costs money on every run. A worker that reads one template produces that template; a worker that reads ten produces a blend.

**If violated.** Implementer output stops matching any single standard, Reviewer findings become arguable, and Master's token spend grows with the archive instead of with the task.

**Where it lives.** [Orchestration](../orchestration.md) meta rules, the *Knowledge assembly* section of every recipe, the Scout role that maps a repo so Master does not have to read it, and the explicit "do not load History by default" notes on non-default areas.

## 4. Low coupling between presentation, AI product, and engineering assets

Docusaurus is a reading UI. Cursor, Codex, Claude Code are adapters. Neither may define engineering meaning.

**Why.** Both will be replaced. A sidebar `_category_.json` that encodes a layering rule, or a Cursor-only rules file that holds the real convention, ties the archive's lifespan to a tool's.

**If violated.** Migrating the site or switching AI products becomes a content migration, and parts of the standard quietly live only in one vendor's config.

**Where it lives.** Thin [entrypoints](../entrypoints/index.md) that hold product-specific mappings only, product-neutral [tools](../tools/index.md) pages, and the rule that `_category_.json` is navigation only.

## Applying them

When two principles pull in different directions, the [precedence](./precedence.md) order decides for rules; for principles, prefer the one that keeps the archive useful **without** the current tool. Durable choices that follow from these principles go into ADRs, not into this page.

Personal engineering preferences that are not yet stable are written as `TODO`, not invented.
