# Workflow: Review

> **개요:** 리뷰 전용 워크플로 순서.

Standalone review when implementation already exists.

Control plane: [`../orchestration.md`](../orchestration.md)

```text
Master: Locate change set
    ↓
Master: Resolve standards (context, Profile, ADRs)
    ↓
Reviewer
    ↓
Optional Tester / QA if requested
    ↓
Master summarize findings
```

Reviewer is read-only by default. “Review + fix” requires Master to say so explicitly (then Implementer).
