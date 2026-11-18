---
format: md
id: k-rewrite
title: "rewrite"
description: "nginx rewrite로 /test 접두사를 제거한 뒤 proxy_pass하는 예제입니다."
tags:
  - Docker
  - HTTP
  - nginx
status: active
slug: /knowledge/k-rewrite
---
# rewrite

## 개요

nginx rewrite로 /test 접두사를 제거한 뒤 proxy_pass하는 예제입니다.

nginx `rewrite`로 URL 접두사를 떼고 업스트림으로 넘기는 예제입니다.
`/test`로 들어온 요청에서 `/test`를 제거한 뒤 컨테이너로 프록시합니다.

## 예제·코드

```nginx
location /test {
  rewrite ^/test(.*)$ $1 break;
  proxy_pass http://a-docker-container;
}
```

<details>
<summary>참고 자료</summary>

- [nginx rewrite 설정 및 rewrite debug 관련 기록](https://yunzema.tistory.com/289) — nginx에서 rewrite 설정을 하다가 기록용으로 남겨 놓는다. /test/something/~~ 과 같이 요청이 들어왔을때, /something/~~ 으로 rerwrite하여 다른 test container에 요청을 전달할 상황이 생겼었다. server 블록 안에 다음과 같이 정의해서 해결했다. location /t
- [http://a-docker-container](http://a-docker-container)
</details>
