# Workflow: Implement

> **개요:** 기능 구현 워크플로 순서.

Default path for feature / implementation work.

Master **selects** (or after gap feedback **authors**) an [`../orchestrations/`](../orchestrations/) recipe.  
Meta: [`../orchestration.md`](../orchestration.md). Roles: [`../agents/`](../agents/index.md).

```text
Requirement
    ↓
Master: find orchestration for situation
    ↓ (miss → developer feedback → write recipe)
Selected orchestration (agents + knowledge)
    ↓
Implementer → Reviewer → Tester → QA  (as listed)
    ↓
Master: run log + final validation
```

Trivial one-file fixes may skip a formal recipe; non-trivial / recurring situations always get a stored orchestration.

See also: [`bugfix.md`](./bugfix.md), [`refactor.md`](./refactor.md), [`review.md`](./review.md).
