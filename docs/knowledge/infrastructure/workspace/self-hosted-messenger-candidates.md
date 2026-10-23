---
format: md
id: k-self-hosted-messenger-candidates
title: 자체 호스팅 메신저 후보 비교
description: Docker로 올릴 수 있는 자체 호스팅 메신저 후보를 공식 배포 문서 기준으로 비교
tags:
  - Docker
  - collaboration
status: active
draft: true
slug: /knowledge/k-self-hosted-messenger-candidates
---
# 자체 호스팅 메신저 후보 비교

> **개요:** Docker로 운영할 수 있는 자체 호스팅 메신저 후보를 공식 배포 문서 기준으로 정리합니다.
> 특정 제품을 선택했다는 결론은 내리지 않습니다.

원문 메모에는 Mattermost, Rocket.Chat, Zulip 등이 후보로 적혀 있었고, Docker로 올릴 수 있는지를 보려 했습니다.

## 비교 요약

| 후보 | 공식 문서에서 말하는 배포 방식 | Docker·컨테이너 |
|---|---|---|
| Mattermost | 계획 → 의존성 준비 → Linux·Kubernetes·컨테이너 중 선택 → 보안·백업 | 컨테이너 배포 방법을 공식 가이드에서 비교·안내 |
| Rocket.Chat | 자체 관리, 클라우드 호스팅, 에어갭 등 | Docker·Docker Compose를 권장 on-premise 방법 중 하나로 안내 |
| Zulip | Ubuntu·Debian 설치 스크립트, Docker 이미지, 클라우드 호스팅 등 | 공식 Docker 이미지로 호스팅하는 선택지를 안내 |

아래는 각 공식 가이드에서 확인한 범위입니다.
운영 규모, 인증(LDAP/SAML), 에어갭, 푸시 알림 정책은 환경마다 달라지므로 선택 전에 해당 문서를 다시 확인합니다.

## Mattermost

[Deployment Guide](https://docs.mattermost.com/guides/deployment.html)는 평가부터 프로덕션까지를 순서대로 안내합니다.

- 배포 시나리오(오프라인·에어갭 등)를 먼저 볼 수 있습니다.
- 서버 배포는 Plan → Prepare(데이터베이스, 파일 저장, 프록시, TLS 등) → 배포 방법 선택 → 보안·백업 순입니다.
- 배포 방법으로 Linux, Kubernetes, 컨테이너를 비교한 뒤 설치하도록 안내합니다.

## Rocket.Chat

[Deployment Guide](https://docs.rocket.chat/docs/deploy-rocketchat)는 자체 관리, 클라우드 호스팅, 에어갭 워크스페이스를 구분해 안내합니다.

- 자체 관리 시 시스템 요구사항을 확인한 뒤 Docker·Docker Compose, Kubernetes(Helm), Podman, OpenShift 등을 선택할 수 있습니다.
- Docker·Docker Compose는 권장 on-premise 방법 중 하나로 적혀 있습니다.
- 스케일, 업데이트, Slack 등에서의 데이터 이전, LDAP·SAML 디렉터리 연동도 같은 가이드 축에 있습니다.

## Zulip

[Install a Zulip server](https://zulip.readthedocs.io/en/stable/production/install.html)는 자체 호스팅 설치 선택지를 나열합니다.

- 직접 서버에 설치하는 절차, 공식 Docker 이미지, DigitalOcean droplet, Zulip Cloud 호스팅이 있습니다.
- 일반 설치는 Ubuntu·Debian 기반에서 릴리스를 받아 설치 스크립트를 실행하는 흐름입니다.
- Slack, Mattermost, Rocket.Chat 등에서의 데이터 가져오기는 별도 import 안내를 따르라고 합니다.

## 참고

- [Mattermost Deployment Guide](https://docs.mattermost.com/guides/deployment.html)
- [Rocket.Chat Deployment Guide](https://docs.rocket.chat/docs/deploy-rocketchat)
- [Zulip Install a Zulip server](https://zulip.readthedocs.io/en/stable/production/install.html)
