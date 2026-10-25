---
format: md
id: k-user-add
title: "user add"
description: "user add"
tags:
  - Linux
  - nginx
status: active
slug: /knowledge/k-user-add
---
# user add

useradd 는 디렉토리 안만들어줌…

```bash
sudo adduser -m -d /home/nginx-user -s /bin/bash nginx-user
sudo passwd nginx-user

sudo adduser -m -d /home/jenkins-user -s /bin/bash jenkins-user
sudo passwd jenkins-user

sudo adduser -m -d /home/app1-user -s /bin/bash app1-user
sudo passwd app1-user

sudo adduser -m -d /home/app2-user -s /bin/bash app2-user
sudo passwd app2-user

sudo adduser -m -d /home/dbuser -s /bin/bash db-user
sudo passwd db-user

```

```bash
cat /etc/passwd

```
