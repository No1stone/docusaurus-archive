---
format: md
id: k-aws-ec2-docker-compose-경로
title: "AWS_Ec2 docker-compose 경로"
description: "EC2에서 docker-compose 루트 권한과 bashrc alias, 경로 메모"
tags:
  - AWS
  - Docker
status: active
slug: /knowledge/k-aws-ec2-docker-compose-경로
---
# AWS_Ec2 docker-compose 경로

> **개요:** EC2에서 docker-compose를 쓸 때 루트 권한과 환경(PATH) 동기화, alias를 남긴 메모입니다.

## 권한과 로그인

docker-compose 사용 시 루트 권한 실행이 필요합니다.

- `su` 로그인만 하면 빌드 패스 등 설정이 동기화되지 않습니다.
- `su -` (또는 `su - root`)로 로그인하면 빌드 패스 등 설정이 동기화됩니다.

## alias

```bash
vi ~/.bashrc
```

예:

```bash
alias docc='docker-compose'
```

![bashrc, 경로 화면](/img/aws-ec2-docker-compose-경로/aws-ec2-docker-compose-경로-1.png)

실제 `docker-compose` 바이너리 경로는 환경에 맞게 PATH에 두거나 절대 경로로 호출합니다.
