---
format: md
id: k-jenkins
title: "jenkins"
description: "Jenkins를 Docker로 띄우고 nginx 리버스 프록시와 프록시 호환 옵션을 맞추는 메모입니다."
tags:
  - Docker
  - Git
  - HTTP
  - nginx
status: active
slug: /knowledge/k-jenkins
---
# jenkins

## 개요

Jenkins를 컨테이너로 기동하고, 앞단 nginx에서 HTTPS·프록시 헤더를 맞춥니다.
리버스 프록시 환경에서는 **Manage Jenkins → Security**에서 Enable proxy compatibility를 켜거나, Script Console에서 CrumbIssuer를 설정합니다.
Generic Webhook Trigger, Pipeline, SSH Pipeline Steps 플러그인을 함께 쓰는 구성입니다.

![jenkins-image.png](/img/jenkins/jenkins-image.png)

## Docker Compose 예

```yaml
services:
  jenkins:
    container_name: jenkins
    image: jenkins/jenkins:jdk17
    restart: always
    ports:
      - 10000:8080
      - 50000:50000
    volumes:
      - ./jenkins_home:/var/jenkins_home
    user: root
    environment:
      TZ: "Asia/Seoul"
    privileged: true
```

## nginx 리버스 프록시 예

```nginx
upstream jenkins {
  server 43.202.195.185:10000;
}

server {
  server_name jenkins.origemite.com;
  listen 80;
  resolver 8.8.8.8 valid=360s;

  location / {
    try_files $uri @jenkins;
  }

  location @jenkins {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_next_upstream error;
    proxy_pass http://jenkins;
    proxy_redirect http:// https://;
    proxy_read_timeout 150;
  }
}
```

## 프록시 호환 Script Console

Jenkins Script Console에서 CrumbIssuer를 켜는 예입니다.

```groovy
import jenkins.model.Jenkins
import hudson.security.csrf.DefaultCrumbIssuer

def jenkins = Jenkins.instance
jenkins.setCrumbIssuer(new DefaultCrumbIssuer(true))
jenkins.save()
println("Proxy compatibility enabled!")
```

<details>
<summary>참고 자료</summary>

- [Jenkins 공식 문서 — Linux 설치](https://www.jenkins.io/doc/book/installing/linux/)
</details>
