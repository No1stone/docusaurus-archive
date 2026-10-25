---
format: md
id: k-centos
title: "CentOs"
description: "CentOS에서 LISTEN 포트 확인과 iptables로 포트 개방"
tags:
  - Linux
status: active
slug: /knowledge/k-centos
---
# CentOs

> **개요:** CentOS에서 리슨 포트를 확인하고 iptables로 TCP 포트를 여는 메모입니다.

## LISTEN 포트 확인

```bash
netstat -nap | grep LISTEN
```

## iptables로 8080 허용

```bash
iptables -I INPUT 1 -p tcp --dport 8080 -j ACCEPT
service iptables save
/etc/init.d/iptables restart
```

방화벽이 firewalld인 환경은 명령이 다를 수 있습니다.
