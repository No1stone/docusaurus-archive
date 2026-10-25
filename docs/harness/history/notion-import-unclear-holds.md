---
id: notion-import-unclear-holds
title: Notion 이전 — 작성자 재검토 대기 목록
description: 게시 보류·제외·재검토 대기 항목. 임의 보완·공개하지 않음
unlisted: true
---
# Notion 이전 — 작성자 재검토 대기 목록

> **개요:** 작성자 검토 결과를 반영한 대기 목록입니다.
> 보류는 완료가 아니라 **작성자 재검토 대기**입니다.
> 임의로 보완하거나 프로덕션에 공개하지 않습니다.
> 게시 보류 글은 `draft: true`라 프로덕션 빌드에 없고, 아래에서는 경로만 적습니다.

원본 경로는 저장소 `_imports/notion/` 기준입니다.

## 작성자 재검토 대기 (보류)

| 대상 | 원본 경로 (`_imports/notion/`) | 현재 작성본 경로 (`docs/…`, `draft`) | 처리 |
|---|---|---|---|
| Javax | `No1Stone Start Page/Spring/RestAPI/Json/Javax ff4c1ec98e3045d585aab0ea359e4aa2.md` | `docs/knowledge/javax-json-se-ee.md` | 작성자 확인 예정. 원문만 보존 |
| dns | `No1Stone Start Page/HTTP/network/dns bd39b198fc6842c5a4d18d46d4e9e2da.md` | `docs/knowledge/dns-memo.md` | 작성자 확인 예정. 원문만 보존 |
| udp | `No1Stone Start Page/HTTP/network/udp 851e310ade3b4c4885db7dfacee46292.md` | `docs/knowledge/udp-memo.md` | 작성자 확인 예정. 원문만 보존 |
| MQ | `No1Stone Start Page/Docker-Compose/MQ ee6a6788deba426280fa01f7b607a09d.md` | `docs/knowledge/mq-memo.md` | 작성자 확인 예정. 원문만 보존 |
| Redis 기동 장애 대응 | (민팃 분리 초안) | `docs/architecture/postmortems/redis-startup-race-incident.md` | 문장 부자연. 추가 재작성 없음 |
| 구축형 메신저 비교 | `…/Docker-Compose/구축형메신저 …` | `docs/knowledge/self-hosted-messenger-candidates.md` | 의도는 사용성·UI 평가. 현재 글 보류 |
| VPC 생성 순서 | `No1Stone Start Page/AWS/vpc/생성순서 23abd019a2034929ae414ef33427f9c9.md` | `docs/knowledge/vpc-creation-order.md` | 수동 구성 과거 기록. 원본·작성본 보존 |
| Webex attachmentActions | `…/UTIL/Webex RestAPI/attachmentActions …` | `docs/knowledge/webhook.md` | 임시 게시 제외·보존 |
| Flux Mono / WebFlux 보완 | `…/Webflux/…/Flux Mono …` | `docs/knowledge/reactive-streame-api.md`, `docs/knowledge/webflux.md` | 임시 게시 제외·보존 |
| `` ` `` (백틱 제목) | `No1Stone Start Page/AWS/\` …` | (작성본 없음) | 의도 불명. 대기 |

## 게시에서 제외 (나중에 재작성·이전 대상 아님)

| 대상 | 처리 |
|---|---|
| CloudWatch 로그 연동 장애 대응 | 내용이 실제 경험과 다름. `docs/architecture/postmortems/cloudwatch-log-integration-incident.md`는 `draft`로 보존, 게시 제외. 나중에 다시 작성 |
| centos (제목만) | 이전 대상에서 제외. 원본 `Linux/centos …`만 유지. 다른 Linux·CentOs 글은 수정하지 않음 |

## 이번 검토로 게시 확정(보완 완료)

| 대상 | 결과 |
|---|---|
| java time error | [java-time-add-opens.md](/docs/knowledge/k-java-time-add-opens) |
| 웹브라우저 요청 흐름 | [web-browser-request-flow.md](/docs/knowledge/k-web-browser-request-flow) |
| GitHub Actions | [github-actions-archive-deploy.md](/docs/knowledge/k-github-actions-archive-deploy) |
