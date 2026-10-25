---
format: md
id: k-scp-file-down
title: "scp file down"
description: "PEM 키로 원격 파일을 scp로 내려받는 명령 메모"
tags:
  - Linux
status: active
slug: /knowledge/k-scp-file-down
---
# scp file down

> **개요:** SSH 키(PEM)를 사용해 원격 서버 파일을 로컬로 받는 `scp` 명령 메모입니다.

```bash
scp -i abc.pem user@192.168.0.1:/home/user/filename /download/
```

- `-i`: 개인 키 파일
- `user@호스트:원격경로`: 받을 파일
- 마지막 인자: 로컬 저장 경로

키 권한은 보통 `chmod 400` 수준으로 제한합니다.
