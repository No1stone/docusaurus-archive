# Engineering Asset Index

> **개요:** 엔지니어링 자산 지도. “뭐가 어디에 있나?” — 사이드바가 아님.

Human- and AI-readable map of **what lives where**.

This is not the Docusaurus sidebar. Agents should start here (or a domain file) instead of scanning the whole repo.

## Domains

- [Backend](./backend.md)
- Frontend — TODO
- Data — TODO
- Infrastructure — TODO
- [AI / Harness](./ai.md)

## Archive areas (`docs/`)

| Area | Path |
|------|------|
| Knowledge | `docs/knowledge/` |
| Architecture | `docs/architecture/` |
| Patterns | `docs/patterns/` |
| Decisions | `docs/decisions/` |
| Experiments | `docs/experiments/` |
| Postmortems | `docs/postmortems/` |
| History | `docs/history/` |

## Other roots

| Area | Path |
|------|------|
| Harness | `docs/harness/` |
| Templates | `docs/harness/templates/` |
| Agent bootstrap | `AGENTS.md` |

## Loading guidance

```text
Index → selected domain map → documents → templates / ADRs → history if needed
```

Agent orchestration (Master + roles): [`../docs/harness/orchestration.md`](../docs/harness/orchestration.md)
