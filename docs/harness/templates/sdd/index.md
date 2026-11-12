---
id: harness-templates-sdd
title: "SDD 템플릿"
description: "제품 저장소 docs/specs 아래로 복사하는 SDD 명세 골격과 작성 양식입니다."
sidebar_position: 1
---

# SDD 제품 명세 템플릿

이 템플릿은 대상 저장소의 지침에서 SDD 도입을 확인한 뒤 사용합니다.<br />
`_template/`의 골격을 제품 저장소의 `docs/specs/domains/{{domain}}/` 또는 `docs/specs/applications/{{application}}/`에 적용합니다.<br />
`{{domain}}`과 `{{application}}`은 제품에서 사용하는 실제 도메인이나 앱 이름으로 바꿉니다.

적용 여부와 읽는 순서는 [SDD 제품 명세 워크플로](/docs/harness/workflows/sdd/)를 봅니다.

```text
_template/
├── requirements-index.md
├── design-index.md
├── work-index.md
├── requirements/
│   └── _template.md
├── design/
│   └── _template.md
└── work/
    └── _template.md
```

세 인덱스는 대상 폴더 바로 아래에 둡니다.<br />
작업 목적에 맞는 인덱스를 열고, 제목을 보고 필요한 상세 문서만 읽습니다.<br />
상세 문서를 추가할 때는 해당 인덱스에 제목과 링크를 등록합니다.

사이트 메뉴에는 이 안내만 두고, 복사용 파일은 저장소 경로 `docs/harness/templates/sdd/_template/`에서 복사합니다.

## 파일명과 정렬

파일명에는 영문 소문자와 하이픈을 사용합니다.<br />
작업 내역은 파일명 앞에 `YYYY-MM-DD` 형식으로 처음 기록한 날짜를 붙입니다.

| 구분 | 파일명 예시 | 인덱스 정렬 |
|---|---|---|
| 요구사항 | `requirements/order-cancellation-policy.md` | 등록, 조회, 취소처럼 기능 흐름순 |
| 설계 | `design/order-lifecycle.md` | 전체 구성에서 세부 흐름 순 |
| 작업 내역 | `work/2026-11-13-block-cancellation-after-shipment.md` | 처음 기록한 날짜의 최신순 |

인덱스에 표시하는 제목은 한 줄만 읽어도 내용을 알 수 있게 씁니다.<br />
요구사항은 **제품이 보장하는 동작**, 설계는 **설계 대상과 흐름**, 작업 내역은 **무엇을 바꾸는지**를 제목에 담습니다.<br />
요구사항에 고정 참조가 필요하면 본문에 `REQ-ORDER-001` 같은 ID를 둡니다.<br />
문서 제목과 본문에서는 항목을 나열할 때 쉼표를 사용합니다.

## 인덱스 양식

아래 주문 취소 예시를 실제 제품의 문서 제목과 경로로 바꿉니다.

### `requirements-index.md`

```markdown
# 요구사항

- [발송 전까지만 주문을 취소할 수 있다](./requirements/order-cancellation-policy.md)
```

### `design-index.md`

```markdown
# 설계

- [주문 상태 전이와 취소 처리 흐름](./design/order-lifecycle.md)
```

### `work-index.md`

```markdown
# 작업 내역

| 날짜 | 작업 | 상태 |
|---|---|---|
| 2026-11-13 | [발송된 주문의 취소 요청 차단](./work/2026-11-13-block-cancellation-after-shipment.md) | 완료 |
```

## 상세 문서 양식

### `requirements/_template.md`

```markdown
# {{제품이 보장하는 동작}}

## 기대 동작

{{누가 어떤 상황에서 무엇을 할 수 있는지 적습니다.}}

## 예외와 경계

{{권한, 거절 조건, 상태에 따라 달라지는 동작을 적습니다.}}

## 통과 기준

- {{초기 상태}}에서 {{행동}}하면 {{관찰 가능한 결과}}가 나온다.
```

### `design/_template.md`

```markdown
# {{설계 대상과 처리 흐름}}

관련 요구사항 [{{요구사항 제목}}]({{상대 경로}})

## 구성과 책임

{{각 구성 요소가 맡는 일을 적습니다.}}

## 처리 흐름

{{요청이나 이벤트를 받은 시점부터 결과를 반환하거나 전달하는 시점까지 적습니다.}}

## 설계 결정과 참조

{{선택한 방식과 이유를 적습니다. 관련 원셋이나 ADR이 있으면 연결합니다.}}
```

### `work/_template.md`

```markdown
# {{무엇을 바꾸는지 드러나는 작업 제목}}

관련 문서 [{{요구사항, 설계 또는 작업 티켓 제목}}]({{링크}})

## 작업 범위

{{이번에 바꿀 동작과 확인할 통과 기준을 적습니다.}}

## 실제 변경

{{완료 후 반영한 내용을 적습니다.}}

## 검증 결과

| 확인 항목 | 검증 방법 | 결과 |
|---|---|---|
| {{통과 기준}} | {{테스트 또는 수동 확인}} | {{통과 / 실패 / 미실행}} |
```

작업을 시작할 때 범위를 적고, 구현 후에는 같은 작업 문서에 실제 변경과 검증 결과를 채웁니다.<br />
상태가 바뀌면 `work-index.md`에서 해당 행을 갱신합니다.
