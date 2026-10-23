---
format: md
id: k-alb-nginx-error
title: "Alb →nginx error"
description: "ALB 뒤에서 nginx와 앱이 HTTP로 리다이렉트할 때 생기는 HTTPS 오류와 헤더 보정"
tags:
  - HTTP
  - nginx
  - AWS
status: active
slug: /knowledge/k-alb-nginx-error
---
# Alb →nginx error

## 개요

ALB 뒤에서 nginx와 앱이 HTTP로 리다이렉트할 때 생기는 HTTPS 오류와 헤더 보정입니다.

원본 메모와 Stack Overflow 사례의 공통점은 다음과 같습니다.
1. ALB(또는 로드밸런서)가 HTTPS를 종료합니다.
2. 뒤의 nginx와 앱은 HTTP로 요청을 받습니다.
3. 로그인과 저장 같은 리다이렉트에서 앱이 ` 로 Location을 만듭니다.
4. 브라우저가 HTTPS 포트로 plain HTTP를 보내 `400 The plain HTTP request was sent to HTTPS port` 등이 납니다.
프록시 뒤에 있을 때 스킴을 앱에 알려 주어야 합니다.
nginx에서는 `X-Forwarded-Proto` 등을 넘기고, 필요하면 `proxy_redirect`로 http를 https로 고칩니다.
ALB가 이미 TLS를 끝낸 뒤 nginx로 HTTP를 넘기는 구성이면, `$scheme`이 `http`일 수 있습니다.
그때는 `X-Forwarded-Proto`를 `https`로 고정하거나, ALB가 넘긴 헤더를 그대로 전달하도록 맞춥니다.
애플리케이션(Jenkins 등)에도 HTTPS URL을 쓰도록 프록시 인식 설정이 필요할 수 있습니다.

## 예제·코드

```nginx
location @app {
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_pass http://jenkins;
  proxy_redirect http:// https://;
}
```

<details>
<summary>참고 자료</summary>

- [Jenkins behind an ALB redirects https to http on login and save (Stack Overflow)](https://stackoverflow.com/questions/73673650/jenkins-behind-an-alb-redirects-https-to-http-on-login-and-save)
- [http://...`](http://...`)
- [http://jenkins](http://jenkins)
</details>
