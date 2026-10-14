# Precedence

> **개요:** 규칙이 충돌할 때 무엇을 우선할지. 각 단계가 뭘 뜻하는지와 실제 충돌 예시.

When rules conflict, prefer higher rows:

```text
Project Local Rules
        >
Current Harness Standards
        >
Profile
        >
Accepted ADR
        >
Template
        >
General Best Practice
```

## What each level means

| Level | What it is | Where it lives |
|-------|------------|----------------|
| **Project Local Rules** | Rules of the repository being worked on: its `AGENTS.md`, `.cursor/rules`, lint/format config, PR template, CI checks, existing code style | the target repo, found by Scout |
| **Current Harness Standards** | What this archive currently says is the way: [coding conventions](./coding-conventions.md), Knowledge pages marked `status: active`, tool rules | `docs/harness/context/`, `docs/knowledge/` |
| **Profile** | The usual asset combo for a kind of stack, including its default verification set | `docs/harness/profiles/` |
| **Accepted ADR** | A recorded decision with context, alternatives, consequences | `docs/decisions/` |
| **Template** | Concrete reference code (RestOutLog table set and enum apply set) | `docs/harness/templates/` |
| **General Best Practice** | What the model knows from the wider world | nowhere in this repo |

## Why this order

- **Local beats archive** because the archive is a default, not a mandate. A project that chose Lombok, a different response wrapper, or physical deletes has reasons; the agent contributing there must match the project, and may *propose* an archive-style change separately.
- **Standards beat Profile** because a Profile is a bundle of pointers; if a pointed-to page was updated, the page wins over the stale summary.
- **ADR beats Template** because the ADR says *why*; a template is one rendering of that why and may lag behind it.
- **Template beats general practice** because the template is what the developer actually does. "Best practice" is the fallback when the archive is silent, never a reason to override it.

## Conflict examples

| Conflict | Resolution |
|----------|------------|
| Project uses Lombok `@Getter/@Setter`; template has explicit getters | Project local wins. Write Lombok. Do not "fix" the project. |
| Project lint enforces 2-space indent; template is 4-space | Project local wins. Formatter config is a local rule. |
| Project has no Facade layer; template Controller → Facade → Service | Project local wins for layering **in that repo**. Scout reports the mismatch; Curator may later propose an ADR if the pattern recurs. |
| Template uses `ModelMapperUtil`; project has another mapper | Project local. Use the host mapper with the same `map` / `mapAll` calls. |
| Knowledge page says `delete()` stays empty until a status column exists; model "knows" hard delete is simpler | Harness standard wins over general practice. Do not add `repository.delete`. |
| Accepted ADR says Markdown + Git is SoT; someone proposes a CMS for docs | ADR wins unless a new ADR supersedes it. |
| Profile lists `backend-unit-test` as default; project has no test runner | Profile is a default; Tester returns `BLOCKED`, Master decides. Nobody invents a runner. |
| Two archive pages disagree | Treat as a bug in the archive. Report to Master; Curator fixes the page. Do not pick silently. |

## Rules for workers

- Implementer (`low` freedom) applies this table mechanically and reports anything it cannot place.
- Reviewer cites the level it is judging against ("Project lint config", "coding-conventions §Transactions").
- Accepted ADRs explain *why* templates look the way they do; when a template seems odd, read the ADR before changing anything.
- General best practice is a last resort, not a license to invent personal standards here.
