---
title: harness backlog
---

> **아카이브:** CMS 업무 백오피스 FE 표준으로 승격했습니다.
> ExampleItem 코드 경로 예: `nutech/fe-v1` (참고용).
> BE 짝 문서는 아카이브에 없을 수 있어 `be-v1/...` 경로로만 표기합니다.

# Harness Backlog & Session Handoff

토큰/시간 제약이 있어도 문서화 작업을 중단 없이 이어가기 위한 운영 문서입니다.

## 사용법

1. 세션 시작 시 이 문서의 `Next Actions`를 먼저 확인
2. 작업 완료 항목은 `Done`으로 이동
3. 새로 발견한 이슈는 `Backlog`에 추가
4. 종료 전 `Session Note`를 3~5줄로 갱신

## Next Actions

- [ ] `RouteTemplate` 전체 page key 목록을 표 형태로 정리
- [ ] `App.tsx` 전역 에러 억제/복구 로직을 위험도 기준으로 분해 문서화
- [ ] `src/api/*` 모듈별 공통 요청 패턴 차이점 정리
- [ ] 테스트/린트 부재에 대한 최소 품질게이트 정책 초안 작성

## Backlog

- [ ] 도메인별 하네스 문서 추가 (`partner`, `operation`, `content`, `configuration`)
- [ ] UI 컴포넌트 계층(atomic) 사용 규칙 초안
- [ ] React Query key naming 컨벤션 문서화 (`query-cache-rules.md`에 공통코드 절 링크)
- [ ] Track 6 보류: locale/TZ platform API, `farmEntityCodes` 삭제(데모 일괄 전환 후)
- [ ] 장애 대응 플레이북(토큰 만료, API timeout, 네트워크 단절) 작성

## Done

- [x] FE 하네스 마스터/인덱스 문서 구조 생성
- [x] FE 공통코드 캐시·i18n 하네스 (`integration/common-code-fe-harness.md`) + CRUD 기본셋 링크
- [x] 런타임/네비게이션/상태/API/환경 문서 초안 생성
- [x] Track 1~4 FE 공통코드 마이그레이션 (가축·농장필터·생애주기·역할)

## Session Note (latest)

- FE 공통코드 Track 1~4 완료: subset 캐시 훅 + i18n (데모·목 미변경).
- 보류: `farmEntityCodes` 삭제, locale/TZ API, 데모 페이지 연동.
