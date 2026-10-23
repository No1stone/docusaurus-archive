---
format: md
id: k-ngrok
title: "ngrok"
description: "ngrok으로 로컬 서버에 공개 HTTPS 터널을 여는 메모입니다."
tags:
  - HTTP
status: active
slug: /knowledge/k-ngrok
---
# ngrok

## 개요

ngrok은 로컬에서 떠 있는 HTTP 서버를 임시 공개 URL로 노출합니다.
웹훅 수신 테스트나 모바일 실기기에서 로컬 API를 칠 때 씁니다.
계정·에이전트 설치 후 authtoken을 등록하고, 로컬 포트로 터널을 엽니다.

```bash
ngrok http 8080
```

유료 플랜에서는 고정 도메인·IP 제한을 쓸 수 있습니다.
토큰과 터널 URL은 외부에 오래 공유하지 않습니다.

<details>
<summary>참고 자료</summary>

- [ngrok](https://ngrok.com/)
- [ngrok documentation](https://ngrok.com/docs)
</details>
