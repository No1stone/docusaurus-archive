---
format: md
id: k-nginx-7dd0ec
title: "nginx"
description: "nginx"
tags:
  - Docker
  - Linux
  - nginx
status: active
slug: /knowledge/k-nginx-7dd0ec
---
# nginx

```bash
sudo amazon-linux-extras list |grep nginx
sudo amazon-linux-extras install -y nginx1
```

nginx 설치위치

```bash
cd /etc/nginx/
```

nginx 기본 log위치 conf 에서바꾸면 바꾼데로 ㄱㄱ

```bash
tail -100f /var/log/nginx/access.log
`docker logs --tail 100 -f <container>`
```

```bash
sudo systemctl start nginx
```

```bash
sudo nginx -s reload
```

rewrite

upstream

Alb →nginx error
