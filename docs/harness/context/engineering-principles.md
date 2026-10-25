# Engineering Principles

> **개요:** 이 아카이브와 하네스가 우선하는 원칙입니다.
> 각각 왜 필요한지, 어기면 무엇이 깨지는지, 아카이브 어디에 반영돼 있는지를 적습니다.

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

**Where it lives.** The folder split under `docs/` (Knowledge / Decisions / Harness). Concept pages stay in Knowledge. The reason for a choice stays in [Decisions](/docs/decisions/).

Knowledge and these principles are what Master reads when a situation needs a judgment.
When a template applies, Implementer builds that shape.
Otherwise Implementer follows the repository's existing pattern, or the minimum change inside the approved scope.
Missing a template does not stop the work.
A new layer, public contract, dependency, or architecture choice goes to Master with options and impact.
Master reads Knowledge and these principles for that decision.
They are not two writings of the same rule.

## 3. Progressive context loading

Never hand an agent the whole archive.
Start from `docs/harness/CURRENT.md` and the documents for this task.
Do not load `docs/history`, `docs/harness/history`, every role file, or every template by default.
Skip re-reading unchanged material; re-check after file changes, context compaction, or a work-area switch ([implement](/docs/harness/workflows/implement)).

**Why.** Context is a budget. Everything loaded that is not needed crowds out what is, makes the model average between conflicting examples, and costs money on every run. A worker that reads one template produces that template; a worker that reads ten produces a blend.

**If violated.** Implementer output stops matching any single standard, Reviewer findings become arguable, and Master's token spend grows with the archive instead of with the task.

**Where it lives.** [implement](/docs/harness/workflows/implement) (read rules), [Orchestration](/docs/harness/orchestration) meta rules, the *Knowledge assembly* section of every recipe, the Scout role that maps a repo so Master does not have to read it, and the explicit "do not load History by default" notes on non-default areas.

## 4. Low coupling between presentation, AI product, and engineering assets

Docusaurus is a reading UI. Cursor, Codex, Claude Code are adapters. Neither may define engineering meaning.

**Why.** Both will be replaced. A sidebar `_category_.json` that encodes a layering rule, or a Cursor-only rules file that holds the real convention, ties the archive's lifespan to a tool's.

**If violated.** Migrating the site or switching AI products becomes a content migration, and parts of the standard quietly live only in one vendor's config.

**Where it lives.** Thin [entrypoints](/docs/harness/entrypoints/) that hold product-specific mappings only, product-neutral [tools](/docs/harness/tools/) pages, and the rule that `_category_.json` is navigation only.

## 5. A pass bar before coding

Before implementation, write the expected result and the done criteria.
That is not a requirement to write tests first, or to cycle failure, pass, and cleanup, on every task.
Reuse existing tests when they already cover the bar.
Skipped or unrun checks are not recorded as pass ([implement](/docs/harness/workflows/implement)).
How each kind of work checks itself is [구현 전 통과 기준](/docs/harness/workflows/acceptance).
Who runs the check is [implement](/docs/harness/workflows/implement).
Done means the requirement is met and existing behavior did not regress.
A green test run alone does not prove that.

**Why.** Vibe coding without a bar ends at "it looks right".
A bar written after the code gets weakened to match whatever was written.

**If violated.** Tests are deleted or expected results are softened so the run turns green.
The mission is then called done with no check for the original requirement or for regressions.

**Where it lives.** [구현 전 통과 기준](/docs/harness/workflows/acceptance), the About page, and the implement workflow.

## Applying them

When two principles pull in different directions, the [precedence](/docs/harness/context/precedence) order decides for rules; for principles, prefer the one that keeps the archive useful **without** the current tool. Durable choices that follow from these principles go into ADRs, not into this page.

Personal engineering preferences that are not yet stable are written as `TODO`, not invented.
