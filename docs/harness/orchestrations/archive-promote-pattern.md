# Orchestration: `archive-promote-pattern`

> **개요:** 프로젝트에서 반복된 것을 아카이브 기준으로 올릴지 제안하는 상황입니다.
> 구현 레시피가 아닙니다. Curator가 제안하고 Master와 작성자가 승인합니다.

| Field | Value |
|-------|--------|
| ID | `archive-promote-pattern` |
| When to use | 반복됐거나, 작성자가 기준으로 말했거나, Postmortem에서 나온 것 |
| When not to use | 한 번 쓴 코드, 아직 구현 중인 기능 |
| Profile hint | 없음 |
| Status | active |

## Agent assembly

| Order | Role | Mission | Required |
|-------|------|---------|----------|
| 0 | Master | 승격 후보와 근거가 있는지 확인합니다. | yes |
| 1 | Curator | 도메인과 비밀을 벗기고 Template, Knowledge, ADR 중 자리와 초안을 제안합니다. | yes |
| 2 | Master | 작성자와 함께 승인하거나 거절합니다. | yes |

Tester와 Implementer는 이 상황에 없습니다.
한 번 쓴 코드는 Experiments에 남습니다.

## Knowledge assembly

| Path | Who | Kind |
|------|-----|------|
| `docs/harness/agents/curator.md` | Curator, Master | current |
| `docs/harness/templates/backend/spring/` | Curator | 코드 모양으로 올릴 때 |
| `index/INDEX.md` | Curator | current |
