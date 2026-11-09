---
sidebar_position: 1
title: Database
description: 하네스 Database 입구. 프로젝트 DB 설계 본문과 Knowledge·페이징·관련 결정을 링크로 연결합니다.
---

# Database

> **개요:** AI가 “하네스에서 DB는 어디?”를 찾을 때 쓰는 입구입니다.
> 규칙 본문은 여기에 복제하지 않습니다.
> 사람용 설계 본문은 [프로젝트 DB 설계](/docs/harness/templates/backend/spring/db-design/)에 둡니다.

## 문서 층

| 층 | 역할 |
|----|------|
| 이 입구 | 나침반, 링크 |
| [DB 설계 하네스](/docs/harness/templates/backend/spring/db-design/) | 프로젝트 선택, 예외, 스케치 |
| [Knowledge Data](/docs/knowledge/data/) | MySQL, JPA, SQL 일반론 |
| Decisions | Flyway 비사용, 알림과 outbox 경계 등 |

## 바로 가기

- [네이밍 · 식별자 · Audit · 인덱스 · 파티션 · 공통코드](/docs/harness/templates/backend/spring/db-design/)
- [유스케이스와 DTO · 목록 PageQuery](/docs/harness/templates/backend/spring/db-design/usecase-dto)
- [PageQuery (기본 20 / 상한 100)](/docs/harness/templates/backend/spring/support/)
- [MySQL 설계·인덱스](/docs/knowledge/data/mysql/)
- [JPA](/docs/knowledge/data/jpa/)
- [Outbox 스케치](/docs/harness/templates/backend/spring/db-design/examples) · [Saga와 Outbox 패턴](/docs/patterns/architecture-patterns/own-events-outbox)
자산 맵은 사이드바 밖 저장소 루트 `index/data.md`입니다.
