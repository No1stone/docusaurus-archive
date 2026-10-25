---
format: md
id: k-ssh-allow
title: "ssh allow"
description: "sshd_config AllowUsers로 SSH 로그인 허용 사용자를 제한하는 메모입니다."
tags:
  - Linux
status: active
slug: /knowledge/k-ssh-allow
---
# ssh allow

## 개요

OpenSSH 서버에서 `AllowUsers`로 로그인 가능한 계정을 명시적으로 제한하는 기록입니다.
허용 목록에 없는 사용자는 SSH로 들어오지 못합니다.

## 설정

`sshd` 설정을 엽니다.

```bash
sudo vi /etc/ssh/sshd_config
```

허용할 사용자를 한 줄씩 둡니다.

```bash
AllowUsers ubuntu
AllowUsers app1-user
AllowUsers app2-user
AllowUsers db-user
```

설정을 반영하려면 서비스를 재시작합니다.

```bash
sudo systemctl restart ssh
```

배포 환경에 따라 유닛 이름이 `sshd`일 수 있습니다.
재시작 전에 키 기반 접속이 가능한지 확인하는 것이 안전합니다.
