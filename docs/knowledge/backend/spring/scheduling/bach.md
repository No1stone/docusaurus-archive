---
format: md
id: k-bach
title: "Bach"
description: "배치 애플리케이션과 Spring Batch의 역할 경계를 정리한 메모입니다."
tags:
  - Spring
  - Batch
status: active
slug: /knowledge/k-bach
---
# Bach

## 개요

배치는 대량 데이터를 정해진 주기로 읽고 가공한 뒤 저장하는 일괄 처리입니다.
같은 일을 웹 요청 스레드에서 돌리면 CPU와 I/O를 독점해 다른 요청을 막기 쉽습니다.
파일명 Bach는 원본 Notion 제목을 따릅니다.

## 배치에 기대하는 조건

- 대용량 데이터를 다룰 수 있을 것
- 사용자 개입 없이 자동 실행될 것
- 잘못된 데이터에도 쉽게 죽지 않을 것(견고성)
- 실패 원인을 추적할 수 있을 것(신뢰성)
- 정해진 시간 안에 끝내거나 다른 앱을 방해하지 않을 것(성능)

실패 지점부터 재실행, 같은 파라미터 중복 실행 방지 같은 요구도 자주 붙습니다.

## Spring Batch와 스케줄러

Spring Batch는 Reader/Processor/Writer로 JDBC, JPA, 파일을 다루고, 청크·스킵·재시작을 제공합니다.
`@Scheduled`나 Quartz는 **언제** 실행할지이고, Batch는 **무엇을 어떻게** 대량 처리할지입니다.
실무에서는 스케줄러가 Batch Job을 실행하는 조합이 흔합니다.
단순 주기 호출만이면 [＠Scheduled](/docs/knowledge/k-scheduled)로도 충분할 수 있습니다.

<details>
<summary>참고 자료</summary>

- [1. 배치란 (jojoldu/spring-batch-in-action)](https://github.com/jojoldu/spring-batch-in-action/blob/master/1_%EB%B0%B0%EC%B9%98%EB%9E%80.md)
</details>
