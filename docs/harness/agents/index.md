# Agents Catalog

> **개요:** 역할 목록, 모델 후보 풀, 자유도. Master만 Opus급이고 자유도 높음. Implementer만 자유도 낮음(코드 스타일 강제 대상), 나머지 워커는 중간. 모델 하나에 고정하지 않음.

| Role | File | Model pool (try in order) | Freedom | Owns |
|------|------|---------------------------|---------|------|
| Master | [`master.md`](./master.md) | Opus-class pool | **high** | Select orchestration / gap / author / dispatch / approve / talk to developer |
| Implementer | [`implementer.md`](./implementer.md) | Cheap coding pool | **low** (only role at this level) | Execute under selected recipe |
| Reviewer | [`reviewer.md`](./reviewer.md) | Cheap checklist pool | medium | Standards check |
| Tester | [`tester.md`](./tester.md) | Cheap checklist pool | medium | Behavioral proof |
| QA | [`qa.md`](./qa.md) | Cheap checklist pool | medium | Success criteria |

Implementer is the role that produces code in the registered style, so it is the only one held at `low`. Checking roles need room to judge, so they sit at `medium`.

Exact candidate lists live in each role file. **Do not hard-require a single slug.**

## Freedom (자유도)

How much a role may deviate from the assembled context (Knowledge, Templates, ADR, orchestration).

| Level | Meaning | Allowed | Not allowed |
|-------|---------|---------|-------------|
| **low** | Follow the listed context literally | Copy template shape; fill blanks with mission data; return `BLOCKED` when context is missing | Alternative designs, new conventions, scope changes, "better" ideas |
| **medium** | Judge *within* the listed standards | Choose among options the context already allows (which test rung, which severity); cite the clause used | Introduce standards not in context; change the mission |
| **high** | Decide, ask, and author | Talk back to the developer, question the request, write new orchestrations, reorder/override worker pools, reject worker output | Large-scale implementation; silently skipping gap reports |

Rules:

- Freedom is a property of the **role**, set in each role file under `## Freedom`.
- An orchestration may **lower** a role's freedom for one situation; it may not raise it.
- Low-freedom roles turn uncertainty into `BLOCKED` / Rework Hint, never into invention.
- Master is the only role expected to hold an ongoing conversation with the developer.

## Model selection rule

```text
1. Read model_candidates for the role (or orchestration override list)
2. Pick the first candidate that exists / is allowed in the current product
3. If none available → tell Master
```

- Lists are **preference order**, not a single required slug.
- Product UIs rename models often — match by **tier intent** (Opus-class / Kimi-code / Haiku / Flash / Composer-fast) when the exact slug is missing.
- Orchestration may narrow or reorder the list; keep **2+** options when possible.

## Model policy (cost)

- **Master only** uses a strong pool (Opus-class). Master verifies worker outputs.
- **Workers** use cheap pools (Kimi code / Haiku / Flash / Composer-fast).
- **Avoid** routine workers on `kimi-k3-max` / K3 by default (~3–4× K2.7 Code on public API lists).
- Cursor/product billing ≠ raw API list price; harness lists are routing hints.

Recipes: [`../orchestrations/`](../orchestrations/)  
Meta: [`../orchestration.md`](../orchestration.md)  
