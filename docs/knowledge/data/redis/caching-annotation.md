---
format: md
id: k-caching-annotation
title: "Caching Annotation"
description: "Spring Cache 애너테이션 (@EnableCaching, @Cacheable 등) 요약"
tags:
  - Redis
status: active
slug: /knowledge/k-caching-annotation
---
# Caching Annotation

> **개요:** Spring의 캐시 추상화 애너테이션을 짧게 정리한 메모입니다.
> Redis 등과 함께 쓸 때 메서드에 붙이는 용도입니다.

## 애너테이션 요약

| 애너테이션 | 역할 |
|---|---|
| `@EnableCaching` | 캐싱 기능을 켭니다. |
| `@Cacheable(value="test")` | 캐시를 쓰는 메서드에 붙입니다. 값이 있으면 가져오고, 없으면 실행 후 등록합니다. |
| `@CacheEvict(value="test")` | 처리 후 해당 캐시를 삭제할 메서드에 붙입니다. |
| `@CachePut(value="test")` | 처리 후 캐시를 갱신합니다. 원 노트 표현대로면 무조건 저장에 가깝습니다. |
| `@Caching` | 여러 캐시 동작을 한곳에 묶을 때 사용합니다. |

원 노트 초안은 아래와 같았습니다.

```
@EnableCaching  // 캐싱 기능을 사용
@Cacheable(value="test")  // 있으면 가져오고 없으면 등록
@CacheEvict(value="test") // 처리 후 캐시 삭제
@CachePut(value="test")   // 처리 후 캐시 수정(무조건 저장)
@Caching                  // 여러 개를 처리할 때
```
