---
id: notion-import-link-rewrite-worklist
title: Knowledge 링크 글 재구성 작업 목록
description: 링크 보완 재구성 결과. 보류·원문 접근 불가·예제 부재 구분
unlisted: true
---
# Knowledge 링크 글 재구성 작업 목록

> **개요:** 링크 자료를 본문 중심으로 재구성한 작업 기록입니다.
> 참조 저장소와 노션 원본은 수정하지 않았습니다.

## 참조 저장소

| 이름 | 로컬 경로 |
|------|-----------|
| 부트베이스 | `/Users/wonseok/Documents/workspace/boot-base` |
| 팜프로 | `/Users/wonseok/Documents/workspace/hanwha/partner-gateway` |

## 게시 보류 유지 (본문 재구성 대상에서 제외)

`draft: true` 및 재검토 대기 목록에 있는 항목입니다.

- `backend/java/json-utils/javax-json-se-ee.md`
- `backend/spring/reactive-web/reactive-streame-api.md`
- `backend/spring/reactive-web/webflux.md`
- `infrastructure/aws/network/vpc-creation-order.md`
- `infrastructure/workspace/self-hosted-messenger-candidates.md`
- `messaging/brokers/mq-memo.md`
- `messaging/delivery/webhook.md`
- `networking/transport/dns-memo.md`
- `networking/transport/udp-memo.md`

## 원문 접근 불가 (링크는 유지, curl 시점 실패)

자동 수집 시 HTTP 실패가 난 URL이 있던 글입니다. 본문은 기존 설명·코드·공식 문서 요약으로 보완했고, 링크는 참고 자료에 남겼습니다.

대표 예:

- `client/browser-guid.md` — andywalpole.me
- `data/jpa/log4jdbc.md` — log4jdbc.brunorozendo.com 등
- `data/sql-ops/flyway.md` — flywaydb.org (수집 시점 실패, 링크 유지)
- `infrastructure/aws/network/vpc.md` — 일부 블로그
- `data/postgresql/작업-postgresql*.md` — 이중화 글 일부

전체 실패 URL 목록은 로컬 작업 산출물 `/tmp/knowledge-link-rewrite-status.json`의 `issues`를 봅니다.

## 예제 부재 (부트베이스·팜프로에 대응 코드 없음)

원문 요약·공식 문서·기존 이미지만으로 본문을 구성했습니다.

- Kafka / Debezium / Pulsar 브로커 운영 글
- AWS SES 발송, S3·EKS·VPC 등 인프라 콘솔·문서 중심 글
- Jenkins·ngrok·sdkman·wiki.js 등 도구 설치 글
- Webex/Dialogflow 연동 중 레포에 없는 부분

## 코드로 보강한 대표 영역

- RestClient / OpenFeign / JWT / SecurityFilterChain / Gateway RouteLocator (부트베이스)
- `@Scheduled` / RestClient 파트너 호출 / QuerydslConfig (팜프로)
- CORS `addCorsMappings` (부트베이스)

