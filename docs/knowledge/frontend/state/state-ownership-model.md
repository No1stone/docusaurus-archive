---
title: State ownership model
description: 서버 상태와 UI 상태 소유권. 경량 헥사와 맞춤
---

# State ownership model

> **채택 기준(신규 구현).** 라이브러리는 강제하지 않습니다.
> 경량 헥사에서 **서버 캐시는 화면 연결·서버 상태 계층**이 다룹니다.
> Flow·개별 기능은 React 훅·캐시 API를 소유하지 않습니다.
> [application-structure](../architecture/application-structure)

## 책임 분리

| 종류 | 소유 | 설명 |
|------|------|------|
| Server state | 화면 연결 훅 + 캐시 계층 | API 응답 원본의 source of truth |
| UI state | 로컬 state 또는 Store | 필터 draft/applied, 모달·시트, 선택 |
| 도메인 타입 | `domain/` 또는 `types/` 등 | 계약만 |
| Application | Flow·개별 기능 | 업무 순서·조합. 훅 비호출 |

React Query·Zustand 등은 선택입니다. 같은 분리만 지키면 됩니다.

## 규칙 (신규)

1. API 응답 원본은 서버 상태 캐시에 둡니다.
2. UI Store에 서버 목록·상세 전체를 장기 복제하지 않습니다.
3. 페이지 이동 시 필터 초기화 정책을 네비게이션(또는 동등 진입)에서 관리합니다.
4. mutation 성공 후 캐시 무효화 없이 로컬만 갱신하지 않습니다.
5. 필터 초기화를 위해 ref·타이머·복잡한 `enabled` 트릭을 **필수 패턴으로 두지 않습니다.**
6. 캐시 라이브러리의 재시도·취소와 Application(Flow) 정책을 이중으로 쓰지 않습니다.

## 안티패턴

- 동일 목록을 캐시와 UI 스토어 양쪽에 장기 보관
- `useEffect`로 쿼리 `data`를 Store에 복사하는 것을 표준으로 삼기
- Flow·개별 기능 안에서 React 훅 호출
- 페이지별 리셋 누락으로 필터 누수

## 이력 참고

과거 ExampleItem·[CodeConventions Legacy](../conventions/CodeConventions)에 API→Store 복사와 마운트 ref 패턴이 있습니다.
**신규 구현은 본 문서와 application-structure만 따릅니다.**

## 관련

- [query-cache-rules](./query-cache-rules)
- [folder-structure](../folder-structure)
- [application-structure](../architecture/application-structure)
