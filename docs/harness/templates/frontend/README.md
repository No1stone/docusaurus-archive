---
sidebar_position: 1
title: Frontend templates
description: CMS 업무 백오피스 FE 원셋 맵. ExampleItem 경로 예 nutech/fe-v1
---

# Frontend templates

> **개요:** 콘솔 FE 구현 참고 원셋입니다.
> Knowledge(왜)와 짝입니다.
> 코드 전문을 모두 붙여 두지 않고, 슬롯과 fe-v1 경로, 스모크 체크리스트로 복사 기준을 줍니다.

안내는 [ONESET.md](/docs/harness/templates/frontend/ONESET)입니다.

## 원셋 목록

| 원셋 | 용도 | 상태 |
|------|------|------|
| [folder-skeleton](./folder-skeleton/) | 빈 폴더 트리 | 가이드 |
| [layout-shell](./layout-shell/) | Admin 레이아웃, 다크 토글 | 가이드 |
| [auth-login](./auth-login/) | 로그인 | 가이드 |
| [auth-recovery](./auth-recovery/) | 비밀번호 재설정 등 | 가이드 |
| [workspace-select](./workspace-select/) | 워크스페이스, 포털 스코프 | 가이드 |
| [cms-crud](./cms-crud/) | **본진** 관리 CRUD | **가이드** (download 미확인) |
| [excel-download](./excel-download/) | 목록 엑셀 (FE 페이징 + xlsx) | 가이드 |
| [dashboard](./dashboard/) | 요약 카드, 위젯 | 가이드 · 경로 미지정 |
| [report-readonly](./report-readonly/) | 읽기 전용 보고 | 가이드 |
| [wizard-register](./wizard-register/) | 다단계 등록 | 가이드 · 경로 미지정 |
| [error-page](./error-page/) | 에러, 권한 없음 | 가이드 |
| [content-static](./content-static/) | 정적 안내 | 가이드 |
| [bulk-upload](./bulk-upload/) | 대량 업로드 | 가이드 |

레이아웃 prop은 `filter` / `list` / `sheets`입니다.

Profile: [cms-backoffice-fe](/docs/harness/profiles/cms-backoffice-fe).
