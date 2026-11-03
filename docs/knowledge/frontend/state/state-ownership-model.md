---
title: State ownership model
description: 서버 상태와 UI 상태 소유권. 라이브러리는 비강제
---

# State ownership model

> **출처:** CMS 업무 백오피스 FE state-ownership-model 승격.
> 라이브러리 강제 없음: 소유권 분리만 하드입니다.

## 책임 분리

| 종류 | 소유 | fe-v1 예 |
|------|------|----------|
| Server state | 조회 훅 + 캐시 계층 | React Query (`src/hooks/use*.ts`) |
| UI state | 모달, 시트, 선택, 검색 draft | zustand (`src/stores/*.ts`) |
| 도메인 타입 | `src/types/*` | — |

다른 저장소는 같은 분리만 지키면 SWR, Redux 등으로 바꿔도 됩니다.

## 규칙

1. API 응답 원본은 서버 상태 캐시를 source of truth로 둡니다.
2. UI 스토어에 서버 원본 전체를 장기 복제하지 않습니다.
3. 페이지 이동 시 필터 초기화 정책을 네비게이션 분기에서 관리합니다.
4. mutation 성공 후 캐시 무효화 없이 로컬만 갱신하지 않습니다.

## 안티패턴

- 동일 목록을 캐시와 UI 스토어 양쪽에 장기 보관
- 페이지별 리셋 누락으로 필터 누수

## 관련

- [query-cache-rules](./query-cache-rules)
