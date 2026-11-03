---
title: Demo vs wired screens
description: 같은 계약에 Demo·Http 구현. 오류 은폐 금지
---

# Demo vs wired screens

> **채택 기준.** UI·개별 기능은 공유하고, **계약의 구현**만 Demo와 Http로 나눕니다.

## 결론

데모와 실연동(wired)을 나눕니다.
화면·위젯·SignIn 같은 개별 기능을 불필요하게 두 벌로 복제하지 않습니다.
같은 `AuthRepository` 등에 `Demo…` / `Http…` 구현을 `app/composition`에서 연결합니다.

## 두 트랙

| 트랙 | 목적 | 데이터 |
|------|------|--------|
| Demo | 레이아웃·슬롯·다크·반응형 | Demo 구현, fixture, **명시적** UI-only 설정 |
| Wired | 실서비스 | Http 구현. 네트워크 오류를 성공으로 바꾸지 않음 |

슬롯(`ManagementPageLayout`의 filter/list/sheets 등)과 Chip·Card 규칙은 공유합니다.
경량 헥사 호출은 [application-structure](./application-structure)입니다.

## 채택 규칙

1. wired에서 네트워크 실패를 **성공·빈 배열로 변환하지 않습니다.**
2. mock/Demo는 **명시 env·조립 경계**에서만 켭니다. DEV만으로 전 구간 폴백하지 않는 것을 권고합니다.
3. 실패와 빈 결과를 구분해 확인합니다.
4. 데이터 진입(구현 교체)만 나눕니다. 화면 전체 복제는 피합니다.

## 이력·관찰 (ExampleItem)

일부 ExampleItem client는 DEV·preview에서 네트워크 오류를 mock 성공으로 바꿉니다.
이는 데모 편의이며 **신규 wired 계약이 아닙니다.** [fe-v1-findings](../operations/fe-v1-findings).
`hooks → api/` 직접 연결도 이력입니다. 신규는 계약←구현입니다.

## 스모크

- 데모: 필터·표·상세·다크 (Demo 구현)
- wired: 성공 / 빈 / **에러** 각각, mutation pending

## 관련

- [folder-structure](../folder-structure)
- [application-structure](./application-structure)
- [error-timeout-policy](../integration/error-timeout-policy)
- [cms-crud](/docs/harness/templates/frontend/cms-crud/)
