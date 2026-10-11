# Tool: Playwright E2E

> **개요:** 실제 브라우저에서 사용자 흐름이 끝까지 동작하는지를 반복 가능한 스크립트로 증명한다.

## Proves

- A user-visible flow (open page → act → see result) works in a real browser engine
- The same flow keeps working later (repeatable, can run in CI)

Does **not** prove: visual polish, performance, backend internals.

## Use when

- Frontend or BFF change touches a flow a user actually performs
- The orchestration lists E2E for this situation
- A manual smoke found a bug and you want it to stay fixed

## Do not use when

- The project has no Playwright setup and the orchestration did not ask to add one (→ `BLOCKED` or `browser-manual`)
- The change is purely backend with no UI surface (→ `backend-unit-test`)

## Inputs

| Need | Source |
|------|--------|
| Running app | dev server URL from the mission or project README |
| Existing specs | target repo's `e2e/` / `tests/` — follow their naming, fixtures, selectors |
| Selectors | prefer roles / test ids already used in the repo; do not invent a new selector strategy |

## Evidence format

Under `## Artifacts`:

```text
command: npx playwright test e2e/item-create.spec.ts
result:  3 passed (chromium)
files:   e2e/item-create.spec.ts (added)
trace:   playwright-report/ (if generated)
```

If a screenshot is the only readable proof, attach the path and say what it shows.

## BLOCKED conditions

- App does not start / URL unreachable
- Login, captcha, or external auth blocks the flow and no test account is in context
- No Playwright in the project and no permission to add it

## Current vs extension

| Item | Status |
|------|--------|
| Playwright with the repo's existing config | current where present |
| Adding Playwright to a project that lacks it | extension — requires the orchestration to say so |
| Visual regression snapshots | extension |

Product mapping (how the agent runs this) lives in [`../entrypoints/`](../entrypoints/index.md).
