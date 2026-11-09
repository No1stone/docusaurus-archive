---
id: repository-pagination-and-slice
title: Page와 Slice
description: Spring Data Page vs Slice, Pageable, 원셋 PageQuery를 정리합니다.
tags:
  - backend
  - spring-data
status: active
slug: "/knowledge/backend/repository/repository-pagination-and-slice"
---

# Page와 Slice, 총건수가 필요한 화면은 어떤 화면일까

운영자가 호출 이력에서 17페이지로 바로 이동하려면 총건수와 마지막 페이지를 알아야 합니다.<br />
반면 모바일 목록이 아래로 내려갈 때마다 20건을 더 보여준다면, 다음 결과가 있는지만 알아도 됩니다.

| 응답 | 호출부에 제공하는 정보 | 조회 비용에서 보는 부분 |
|---|---|---|
| `Page` | 현재 결과, 전체 건수, 전체 페이지 | 총건수가 필요하면 별도 count 쿼리 사용 가능 |
| `Slice` | 현재 결과, 다음 묶음 존재 여부 | 다음 항목 확인을 위해 요청 크기보다 한 건 더 조회하는 방식이 일반적 |

## 원셋에서 목록을 읽는 흐름

```text
HTTP 검색 조건 → Filter와 PageQuery
                 → Adapter에서 Pageable로 변환
                 → Repository에서 Specification과 함께 조회
```

원셋의 `findAll(specification, pageable)`은 `Page`를 반환합니다.<br />
화면에서 총건수를 표시하는 목록에는 이 계약이 맞습니다.<br />
반환값을 `Slice`로 감싸기만 하면 기존 조회에서 이미 실행한 count가 사라지지 않습니다.<br />
다음 묶음만 제공하려면 실제 조회 경로를 그 목적에 맞게 바꿉니다.

같은 시각에 기록된 행이 여러 개라면 시간에 ID를 보조 정렬로 더해 순서를 일정하게 유지합니다.<br />
대량 데이터의 깊은 페이지에서는 `Slice`를 써도 큰 offset 자체는 남으므로, 사용자가 이동하는 방식에 맞춰 커서 기반 조회도 검토할 수 있습니다.
[Specification과 Filter](/docs/knowledge/backend/repository/repository-spec-and-filter) / [원셋 PageQuery](/docs/harness/templates/backend/spring/support/)

## 21건을 읽어 20건만 보여주는 흐름

한 페이지 크기가 20일 때, 21건을 조회한 Slice는 처음 20건을 반환하고 다음 결과가 있다고 표시할 수 있습니다.<br />
20건 이하만 조회됐다면 현재 조건에서 다음 결과가 없습니다.

![Slice가 다음 페이지를 판단하는 흐름](/img/backend-design/slice-lookahead.svg)

| DB에서 읽은 결과 | 화면에 표시할 수 | 다음 요청 |
|---|---:|---|
| 21건 | 20건 | 가능 |
| 20건 | 20건 | 없음 |
| 8건 | 8건 | 없음 |

이 예시는 한 건을 더 읽는 조회를 실제로 구현했을 때의 동작입니다.<br />
원셋의 Page 방식과 비교할 때는 동일한 필터와 정렬을 적용하고, SQL 로그에서 count 쿼리의 실행 여부를 확인합니다.

## 참고 자료

- [Spring Data의 페이지 및 슬라이스 쿼리 메서드](https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html)
