---
format: md
id: k-local-nginx
title: "local nginx"
description: "local nginx"
tags:
  - AWS
  - HTTP
  - Linux
  - nginx
status: active
slug: /knowledge/k-local-nginx
---
# local nginx

## 개요

local nginx에 대한 메모입니다.

## 예제·코드

```bash
# 1. gw-user 홈 디렉토리 이동
cd /mnt/data1/app1-user

# 2. Nginx 다운로드 및 압축 해제
wget http://nginx.org/download/nginx-1.25.3.tar.gz
tar -xzf nginx-1.25.3.tar.gz
mv nginx-1.25.3 nginx

# 3. 빌드에 필요한 패키지 설치
sudo apt update
sudo apt install -y build-essential libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev

# 4. Nginx 빌드 및 설치
cd nginx
./configure --prefix=/mnt/data1/app1-user/nginx --with-http_ssl_module --without-http_rewrite_module
make && make install

```

```bash
sudo setcap 'cap_net_bind_service=+ep' /mnt/data1/app1-user/nginx/sbin/nginx

sudo setcap 'cap_net_bind_service=+ep' /mnt/data1/app1-user/nginx/sbin/nginx
/mnt/data1/app1-user/nginx/sbin/nginx

```

```bash
mkdir -p /mnt/data1/app1-user/nginx/conf.d
mkdir -p /mnt/data1/app1-user/nginx/logs
mkdir -p /mnt/data1/app1-user/nginx/www

# 기본 Nginx 설정 파일 작성
cat <<EOF > /mnt/data1/app1-user/nginx/conf/nginx.conf
worker_processes auto;
error_log  logs/error.log warn;
pid        logs/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80;
        server_name localhost;

        location / {
            root   /mnt/data1/app1-user/nginx/www;
            index  index.html;
        }
    }
}
EOF

# 기본 index.html 생성
echo "<h1>Hello from Nginx running under app1-user!</h1>" > /mnt/data1/app1-user/nginx/www/index.html

```

<details>
<summary>참고 자료</summary>

- [http://nginx.org/download/nginx-1.25.3.tar.gz](http://nginx.org/download/nginx-1.25.3.tar.gz)
</details>
