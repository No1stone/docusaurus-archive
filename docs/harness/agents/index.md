# Agents Catalog

> **개요:** 역할 목록과 모델 후보 풀. Master만 Opus급, 나머지는 저가 후보 중 있는 것부터. 모델 하나에 고정하지 않음.

| Role | File | Model pool (try in order) | Owns |
|------|------|---------------------------|------|
| Master | [`master.md`](./master.md) | Opus-class pool | Select orchestration / gap / author / dispatch / approve |
| Implementer | [`implementer.md`](./implementer.md) | Cheap coding pool | Execute under selected recipe |
| Reviewer | [`reviewer.md`](./reviewer.md) | Cheap checklist pool | Standards check |
| Tester | [`tester.md`](./tester.md) | Cheap checklist pool | Behavioral proof |
| QA | [`qa.md`](./qa.md) | Cheap checklist pool | Success criteria |

Exact candidate lists live in each role file. **Do not hard-require a single slug.**

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
