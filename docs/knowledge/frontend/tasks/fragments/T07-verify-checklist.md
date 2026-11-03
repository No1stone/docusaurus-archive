---
title: T07 verify checklist
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# T07 — 태스크 단위 검수 체크리스트

> **한 메뉴(태스크)만** 검수한다. 전체 콘솔 회귀는 릴리즈 전 별도.

## 메타

- pageId: `________________`
- 태스크 카드: `tasks/pages/________.md`
- 검수자 / 일자: ___________

## A. 필터

- [ ] 조회 버튼 후에만 목록 API 호출
- [ ] 초기화 동작
- [ ] siteCode별 필터 필드 (T01 해당 시)
- [ ] 공통코드 필터: typeId 최소 로드 · `nameMaps` 공유 (해당 시)

## B. 목록

- [ ] 페이징·pageSize
- [ ] 상태 Badge (A/D 문자열 없음)
- [ ] 공통코드 Chip (T04 해당 시) — raw code 없음 · 캐시/i18n 라벨
- [ ] 빈/로딩/에러

## C. 상세·CRUD

- [ ] 행 클릭 → 상세
- [ ] 등록 (C)
- [ ] 수정 (U)
- [ ] 비활성 (D) — 라벨 "비활성"
- [ ] 다운로드 (X) — 해당 시

## D. API·BE 짝

- [ ] Network 탭 URL·camelCase body
- [ ] BE Swagger `Web` summary 존재
- [ ] 성공 코드 `0000` 계열

## E. i18n

- [ ] ko 최소 · en 키 존재

## F. import·빌드 (FE — 마지막 필수)

→ [QA-fe-import-check](../pipeline/qa/QA-fe-import-check.md) 요약:

- [ ] 변경 `ts`/`tsx` — 사용 심볼 전부 `import`됨
- [ ] `npm run build:console` (또는 해당 site) 성공
- [ ] 메뉴 진입·상세 — 콘솔 `ReferenceError` 없음

## G. 갭·후속

| 항목 | 액션 | 담당 |
|------|------|------|
| | 설계요청 / 자체설계 / — | |

**판정:** ☐ 통과 · ☐ 조건부(갭 문서화) · ☐ 보류
