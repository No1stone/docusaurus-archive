---
format: md
id: k-openssl-base64
title: "openssl base64"
description: "openssl로 base64 난수를 생성하는 명령 메모"
tags:
  - Linux
status: active
slug: /knowledge/k-openssl-base64
---
# openssl base64

> **개요:** OpenSSL로 base64 인코딩된 난수 문자열을 만드는 짧은 메모입니다.

```bash
openssl rand -base64 255
```

비밀값, 토큰 후보를 만들 때 쓰는 명령입니다.
생성된 값은 용도에 맞게 길이, 저장 방식을 정합니다.
