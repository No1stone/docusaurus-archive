---
format: md
id: k-local-https-mkcert
title: "local Https Mkcert"
description: "로컬 HTTPS용 인증서와 mkcert.org 링크를 정리한 글"
tags:
  - HTTP
  - TLS
status: active
slug: /knowledge/k-local-https-mkcert
---
# local Https Mkcert

## 개요

로컬 HTTPS용 인증서와 mkcert.org 링크를 정리한 글입니다.

> 저장된 URL과 제목의 대상이 다를 수 있어, 접속한 페이지 내용을 기준으로 적습니다.
는 브라우저가 아닌 도구용으로, 신뢰할 루트 CA 목록을 골라 PEM으로 내려받는 API 성격의 서비스입니다.
Mozilla 신뢰 목록을 바탕으로 원하는 CA만 포함하거나 제외한 PEM을 만들 수 있습니다.
로컬 개발용 사설 CA를 자동 설치해 주는 CLI와는 목적이 다릅니다.
제목의 “local Https” 의도와 달리, 이 사이트는 커스텀 trust store PEM 생성에 가깝습니다.
로컬 호스트에 신뢰되는 개발용 인증서를 만들 때 널리 쓰이는 CLI는 FiloSottile의 mkcert입니다.
저장 URL은 아니나, 제목 의도를 보완하기 위해 공식 README의 최소 사용만 적습니다.
생성된 PEM을 웹 서버나 리버스 프록시에 직접 연결해야 합니다.
`rootCA-key.pem`은 유출되면 기기 트래픽을 가로챌 수 있으므로 공유하지 않습니다.

## 예제·코드

```bash
curl https://mkcert.org/generate/dst+digicert
curl https://mkcert.org/labels/
```

```bash
mkcert -install
mkcert example.com localhost 127.0.0.1 ::1
```

<details>
<summary>참고 자료</summary>

- [mkcert.org](https://mkcert.org/)
- [FiloSottile/mkcert (로컬 신뢰 인증서 CLI)](https://github.com/FiloSottile/mkcert) — A simple zero-config tool to make locally trusted development certificates with any names you'd like. - FiloSottile/mkcert
- [https://mkcert.org/generate/dst+digicert](https://mkcert.org/generate/dst+digicert)
</details>
