---
format: md
id: k-user
title: "user"
description: "EC2에서 root 비밀번호를 설정하고 SSH 비밀번호 인증을 끄는 작업 메모입니다."
tags:
  - AWS
  - Linux
status: active
slug: /knowledge/k-user
---
# user

## 개요

EC2에서 root 계정 비밀번호를 설정한 뒤, SSH 비밀번호 인증을 끄고 root로 전환하는 절차 메모입니다.

## 절차

root 비밀번호를 설정합니다.

```bash
sudo passwd root
```

비밀번호 인증을 끄고 root 셸로 들어갑니다.

```bash
sudo passwd root
sudo echo 'PasswordAuthentication no' >> /etc/ssh/sshd_config
su - root
```

`sshd_config`를 바꾼 뒤에는 SSH 서비스 재시작이 필요할 수 있습니다.
키 기반 접속이 가능한지 확인한 뒤에 비밀번호 인증을 끄는 것이 안전합니다.
