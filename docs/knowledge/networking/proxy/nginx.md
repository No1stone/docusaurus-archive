---
format: md
id: k-nginx
title: "NGINX"
description: "NGINX"
tags:
  - Docker
  - HTTP
  - nginx
status: active
slug: /knowledge/k-nginx
---
# NGINX

## 개요

NGINX에 대한 메모입니다.

listen = port
server_name = domain
location = url
해당 파일들을 미리생성에서 내용도 채워야함
nginx.conf / default.conf / index.html

## 예제·코드

```docker
version: "3"

services:

  nginx:
    image: nginx:latest
    volumes:
      - ./templates:/etc/nginx/templates
      - ./templates/nginx.conf:/etc/nginx/nginx.conf
      - ./templates/default.conf:/etc/nginx/conf.d/default.conf
      - ./templates/index.html:/usr/share/nginx/html/index.html
    ports:
      - "8080:80/tcp"
      - "443:443"
    environment:
      - NGINX_HOST=127.0.0.1
      - NGINX_PORT=80
      - TZ=Asia/Seoul
```

```json
server{
	listen 80:
	server_name sun.domain.com
	location / {
		proxy_pass http://127.0.0.1:8080
	}
	location /api {
		proxy_pass http://127.0.0.1:8080
	}
}

```

<details>
<summary>참고 자료</summary>

- [Beginner’s Guide](http://nginx.org/en/docs/beginners_guide.html)
- [nginx - Official Image | Docker Hub](https://hub.docker.com/_/nginx) — Official build of Nginx.
- [https://docs.3rdeyesys.com/compute/ncloud_compute_lemp_nginx_ssl_setting_ubuntu_guide.html#hosts-파일-수정](https://docs.3rdeyesys.com/compute/ncloud_compute_lemp_nginx_ssl_setting_ubuntu_guide.html#hosts-%ED%8C%8C%EC%9D%BC-%EC%88%98%EC%A0%95)
</details>
