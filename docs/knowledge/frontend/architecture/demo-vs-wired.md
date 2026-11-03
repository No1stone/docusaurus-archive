---
title: Demo vs wired screens
description: 퍼블/데모 UI와 API 연결 구현 화면을 분리하는 규칙
---

# Demo vs wired screens

> **개요:** 디자인(퍼블, 데모) 화면과 API가 붙은 구현 화면을 나눕니다.
> FarmPro FE에서 데모에 API를 입힌 뒤, 디자인 변경과 실구현이 한 파일에서 충돌했던 경험을 아카이브 규칙으로 고정합니다.
> fe-v1 앱을 이 문서 때문에 수정할 필요는 없습니다.

## 결론

**나누는 편이 낫습니다.**
디자인 반복과 API 계약 안정화는 주기가 다릅니다.
한 페이지에 둘을 섞으면 나중에 디자인만 바꾸거나 API만 바꿀 때 비용이 커집니다.

## 두 트랙

| 트랙 | 목적 | 데이터 | 이름/위치 관례 (예) |
|------|------|--------|---------------------|
| Demo / publishing | 레이아웃, 슬롯, Chip, 다크, 반응형 확정 | mock, 고정 fixture | `*DemoPage`, `*ReportDemo*`, `data/*Mocks` |
| Wired / implement | 실서비스 동작 | `api/` + hooks 캐시 | `*ManagePage`, 도메인 정식 페이지 |

작업 순서는 보통 **데모로 슬롯을 맞춘 뒤**, 별도 wired 페이지(또는 명확한 분기)에 API를 연결합니다.

## 하지 말 것

1. 데모 페이지에 API 훅을 장기적으로 섞어 “중간 상태” 페이지를 만들지 않습니다.
2. mock과 실응답을 같은 컴포넌트 안에서 플래그로만 계속 분기하지 않습니다. 분기가 필요하면 **어댑터 경계**를 둡니다.
3. 디자인 변경을 wired 페이지에서 직접 시험하다가 API 회귀를 감수하지 않습니다. 데모에서 맞춘 뒤 이식합니다.

## 해도 되는 공유

슬롯 계약과 프리젠테이션은 공유합니다.

- `ManagementPageLayout`, 필터 kit, Chip, Card 섹션 규칙
- [ui-composition-rules](./ui-composition-rules), [loading-action-ux](../design/loading-action-ux)

데이터 진입만 다릅니다.

```text
DemoPage  -> mocks / demo helpers
WiredPage -> hooks -> api
둘 다     -> 같은 molecules/templates 슬롯
```

## 승격

데모가 확정되면 wired로 **복사 또는 치환**하고, 데모는 퍼블 참고로 남기거나 제거합니다.
데모에 API를 “임시로” 붙인 채 방치하지 않습니다.

## 원셋과의 대응

| 원셋 | 기본 트랙 |
|------|-----------|
| [report-readonly](/docs/harness/templates/frontend/report-readonly/) | 데모로 시작하기 쉬움. README에 mock/API를 슬롯상 동등하게 두되 페이지는 분리 |
| [cms-crud](/docs/harness/templates/frontend/cms-crud/) | ExampleItem은 wired (`*ManagePage`). 신규는 데모 먼저 가능 |

## 스모크 구분

- 데모: 필터, 표, 상세, 다크, 반응형 (네트워크 불필요)
- wired: 위 + 실 API 성공/빈/에러, mutation pending

## 관련

- [folder-structure](../folder-structure)
- [query-cache-rules](../state/query-cache-rules)
- [console-crud-base-set](../integration/console-crud-base-set)
