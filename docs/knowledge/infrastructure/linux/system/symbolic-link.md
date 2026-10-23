---
format: md
id: k-symbolic-link
title: "symbolic link"
description: "symbolic link"
tags:
  - Linux
  - nginx
status: active
slug: /knowledge/k-symbolic-link
---
# symbolic link

```bash
sudo su - nginx-user
mkdir -p ~/nginx-config
cd ~/nginx-config
```

시스템 /ect/nginx 파일을 유저에게 이동후 원래경로에 심볼릭 링크를 설정해서 적용

```bash
sudo mv /etc/nginx/nginx.conf ~/nginx-config/nginx.conf
sudo ln -s ~/nginx-config/nginx.conf /etc/nginx/nginx.conf

sudo mv /etc/nginx/conf.d ~/nginx-config/conf.d
sudo ln -s ~/nginx-config/conf.d /etc/nginx/conf.d 
```
