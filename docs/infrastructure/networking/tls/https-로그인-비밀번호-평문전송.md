---
format: md
id: k-https-로그인-비밀번호-평문전송
title: "HTTPS 로그인 비밀번호 평문전송"
description: "HTTPS에서 로그인 비밀번호가 평문으로 보여도 되는지에 대한 정리 글 링크 메모입니다."
tags:
  - HTTP
  - HTTPS
  - Security
status: active
slug: /knowledge/k-https-로그인-비밀번호-평문전송
---
# HTTPS 로그인 비밀번호 평문전송

## 개요

HTTPS에서 로그인 비밀번호가 평문으로 보여도 되는지에 대한 정리 글 링크 메모입니다.

> 원문에도 정리잘된블로그라고 적혀 있었습니다.
저장된 URL은 다음과 같습니다.
이 보완 시점에 해당 페이지는 404(또는 호스트에서 403)로 본문을 확인하지 못했습니다.
제목과 경로만으로 보면, 브라우저 개발자 도구이나 프록시에서 JSON, 폼 필드의 비밀번호가 그대로 보이는 현상과 TLS 구간 암호화를 구분하는 설명으로 추정됩니다.
사실 관계를 원문에서 재확인할 수 없으므로 세부 주장은 적지 않습니다.
일반적으로는 전송 구간 보호(HTTPS)와 서버 저장 시 해시, 솔트, 그리고 클라이언트 추가 암호화를 구분해서 봅니다.
정확한 논지는 링크가 복구되거나 동일 주제의 신뢰할 수 있는 자료를 다시 확인할 때 보완합니다.

<details>
<summary>참고 자료</summary>

- [HTTPS plain text safety (접근 실패: 404/403)](https://yoonhogo.github.io/blog/2020-09-08/HTTPS-plain-text-safety/)
</details>
