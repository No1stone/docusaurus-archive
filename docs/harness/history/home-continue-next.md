---
id: home-continue-next
title: 집 이어서 — 다음 작업
description: 사무실에서 중단한 아카이브 작업. 집에서 이어서 할 일만 적습니다.
unlisted: true
---
# 집 이어서 — 다음 작업

> **개요:** 2026-10-23 기준 남은 일입니다.
> 이 문서는 `unlisted`라 사이트 메뉴에 안 나옵니다. 저장소·하네스에서만 봅니다.

시작 시 [`CURRENT.md`](../CURRENT.md)와 이 글만 먼저 읽으면 됩니다.

## 참조 경로

| 이름 | 경로 |
|------|------|
| 부트베이스 | `/Users/wonseok/Documents/workspace/boot-base` |
| 팜프로 | `/Users/wonseok/Documents/workspace/hanwha/partner-gateway` |
| 아카이브 | `/Users/wonseok/Documents/workspace/docusaurus-archive` |

## 이미 끝난 것 (다시 하지 말 것)

- Notion → Knowledge 이전·분야 분류·의미 단위 하위 폴더
- Patterns GoF + architecture-patterns (Saga, Outbox/Inbox, 분산락, CQRS, CDC, Fan-out, Gateway)
- Postmortems (icomsys 포트폴리오 등) + 리다이렉트
- AdSense 자동 광고만 (수동 AdSlot 제거)
- 링크 글 재구성 1차 (대표 3: RestAPI / @Scheduled / JWT 포함, details 참고 자료)
- `npm run build` 통과 상태였음 (커밋 직전 재확인)

## 집에서 이어서 할 일

### 1. 게시 보류 draft — 작성자 재검토 (임의 공개·대량 보완 금지)

목록: [`notion-import-unclear-holds.md`](./notion-import-unclear-holds.md)

| 경로 |
|------|
| `docs/knowledge/backend/java/json-utils/javax-json-se-ee.md` |
| `docs/knowledge/backend/spring/reactive-web/reactive-streame-api.md` |
| `docs/knowledge/backend/spring/reactive-web/webflux.md` |
| `docs/knowledge/infrastructure/aws/network/vpc-creation-order.md` |
| `docs/knowledge/infrastructure/workspace/self-hosted-messenger-candidates.md` |
| `docs/knowledge/messaging/brokers/mq-memo.md` |
| `docs/knowledge/messaging/delivery/webhook.md` |
| `docs/knowledge/networking/transport/dns-memo.md` |
| `docs/knowledge/networking/transport/udp-memo.md` |

### 2. 링크 글 품질 2차 (원하는 만큼)

1차에서 일괄 처리된 글 중 본문이 얇거나 원문 요약만인 것은, 대표 3건과 같은 기준으로 손보면 됩니다.

- 기준·구분: [`notion-import-link-rewrite-worklist.md`](./notion-import-link-rewrite-worklist.md)
- 코드 있으면 부트베이스·팜프로 중심으로 재구성
- 없으면 원문 핵심만 짧게 + details 참고 자료
- draft 보류 글은 건드리지 않음

우선 손보면 좋은 후보(예제 부재·얇은 본문 쪽):

- Messaging: Kafka, Pulsar, Dialogflow/Webex 일부
- Infrastructure: S3·EKS·VPC·Docker 설치류 중 링크 위주였던 글
- Tooling: Jenkins 외 CI/도구 글 중 개요만 있는 것

### 3. 원문 접근 불가 URL

수집 시점 HTTP 실패 URL은 링크만 유지한 상태입니다.
집에서 브라우저로 다시 열고, 되면 본문을 보강하면 됩니다.
대표는 worklist의 「원문 접근 불가」 절.

### 4. 선택

- harness 매핑/카탈로그와 실제 경로 불일치가 보이면 짧게 맞춤
- 이미지 깨짐·상대 경로만 보이면 해당 글만 수정
- 커밋은 논리 단위로 나누기 (이미 푸시된 것과 섞지 말 것)

## 검증

```bash
cd /Users/wonseok/Documents/workspace/docusaurus-archive
npm run build
```

## 하지 말 것

- 보류 draft를 임의로 `draft: false`로 바꾸기
- 부트베이스·팜프로·노션 원본 수정
- 검증 생략을 통과로 적기
