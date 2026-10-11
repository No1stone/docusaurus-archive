# Tool: Browser manual smoke

> **개요:** 에이전트가 크롬을 직접 열어 화면을 조작하고 지금 이 순간 제대로 뜨는지 확인한다. 빠르지만 반복 불가라 라벨을 분명히 붙인다.

## Proves

- The page renders, the element exists, the click does what was asked — **right now**
- Layout / copy changes look as intended (with a screenshot)

Does **not** prove: it will keep working. This is a smoke check, not a regression test.

## Use when

- Frontend change where a human would normally "open it and click around"
- Verifying a UI fix before deciding whether a Playwright spec is worth writing
- No E2E setup exists and the orchestration allows manual smoke

## Do not use when

- The orchestration requires repeatable evidence (→ `playwright-e2e`)
- The action is destructive or irreversible on real data

## Inputs

| Need | Source |
|------|--------|
| Running app | dev server URL from the mission |
| Browser control | product capability — see [`../entrypoints/`](../entrypoints/index.md) |
| What to check | the mission's acceptance list; do not wander |

## Procedure

```text
1. Navigate to the target URL
2. Snapshot (accessibility tree) → confirm expected elements exist
3. Perform the mission's actions (click, type, submit)
4. Snapshot / screenshot → confirm expected result
5. Record each step as evidence
```

Stop and report after four failed attempts at the same step. Do not loop.

## Evidence format

Under `## Artifacts`, labelled clearly as manual:

```text
kind:    manual smoke (not repeatable)
url:     http://127.0.0.1:3000/items
steps:   open → click "New item" → fill name → submit
observed: list shows the new row; no console errors
screenshot: /path/to/shot.png
```

QA treats manual smoke as weaker evidence than a passing spec and may ask for `playwright-e2e` when the orchestration requires it.

## BLOCKED conditions

- Login / captcha / passkey needs a human
- Browser control is not available in the current product
- Page depends on data that does not exist locally

## Current vs extension

| Item | Status |
|------|--------|
| Agent-driven browser smoke | current when the product offers browser control |
| Promoting a smoke path to a Playwright spec | recommended follow-up, not automatic |
