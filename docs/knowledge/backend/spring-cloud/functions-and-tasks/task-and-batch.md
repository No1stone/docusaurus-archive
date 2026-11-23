---
id: spring-cloud-functions-and-tasks-task-and-batch
title: Cloud Task와 Spring Batch 조합
description: Task와 Spring Batch를 함께 쓰는 범위를 정리합니다.
slug: /knowledge/backend/spring-cloud/functions-and-tasks/task-and-batch
sidebar_position: 4
status: active
tags: [Spring, Spring Cloud]
keywords:
  - "Cloud Task와 Spring Batch 조합"
  - "Spring"
  - "Spring Cloud"
  - "Spring Cloud Function"
  - "Spring Cloud Task"
  - "Spring Batch"
  - "Cloud"
  - "Task"
---
# Cloud Task와 Spring Batch 조합

Task와 Spring Batch를 함께 쓰는 범위를 정리합니다.

## 이 글에서 다룰 범위

- Task가 감싸는 범위와 Job의 범위
- 이력과 재시작 책임
- SCDF 연결 지점

상세 설정과 코드 예제는 이후 본문에서 채웁니다.
기존 Legacy 메모가 있으면 공개 URL을 유지한 채 연결합니다.

## 자주 묻는 질문

### Cloud Task와 Spring Batch 조합은 어떤 문제를 다루나요?

이 글은 Cloud Task와 Spring Batch 조합의 범위를 먼저 고정합니다. 상세 설정과 코드 예제는 이후 본문에서 채웁니다.

### 지금 바로 운영에 적용해도 되나요?

골격 단계이므로 도입 판단은 공식 문서와 현재 지원 상태를 함께 확인한 뒤 합니다.
