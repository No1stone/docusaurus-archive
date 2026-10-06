# Bundles

> **개요:** 이번 작업에서 실제로 읽을 컨텍스트 묶음(선택). Profile(종류별 기본)과 다르다.

A **Bundle** answers: *what should be read?*

A **Task orchestration** answers: *what to read + which agents + success criteria?*  
→ Prefer [`../orchestrations/`](../orchestrations/) for real jobs. Bundles are optional helpers Master may embed or link.

| Concept | Question |
|---------|----------|
| Profile | What does this *kind* of work usually need? |
| Bundle | What documents might we read? |
| Task orchestration | What do we load **and** run **this time**? |

## Current status

Skeleton. No automatic generator required.

## Example shape (illustrative)

```text
task: add validation to checkout API
reads:
  - docs/knowledge/backend/controller/controller-design.md
  - docs/harness/profiles/spring-api.md
  - docs/harness/templates/backend/spring/controller/README.md
```

Promote into `docs/harness/orchestrations/{task-id}.md` when agents must run.
