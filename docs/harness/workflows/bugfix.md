# Workflow: Bugfix

> **개요:** 버그 수정 워크플로 순서.

Control plane: [`../orchestration.md`](../orchestration.md)

```text
Master: Reproduce / clarify failure
    ↓
Master: Context Resolution (narrow)
    ↓
Implementer (minimal fix)
    ↓
Reviewer → Tester → QA
    ↓
Master finalize
```

Prefer minimal context: related Knowledge, Template, and Postmortem/History **only** if the bug traces to a known past issue.
