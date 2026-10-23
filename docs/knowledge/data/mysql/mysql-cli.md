---
format: md
id: k-mysql-cli
title: "MYSQL CLI"
description: "mysqldump, mysql 접속, 권한, Docker exec로 MySQL CLI를 쓰는 메모"
tags:
  - Docker
status: active
slug: /knowledge/k-mysql-cli
---
# MYSQL CLI

> **개요:** MySQL 클라이언트와 mysqldump, 권한 부여, Docker 컨테이너 안에서 mysql에 들어가는 명령을 모아 둔 메모입니다.

## 덤프

```bash
mysqldump -u [username] -p[database name] [database_name] > [dump_file.sql]
```

`-p` 뒤에 비밀번호를 붙이거나, `-p`만 두고 대화형으로 입력할 수 있습니다.
원 노트의 placeholder를 그대로 두었습니다.

## 접속

```bash
mysql -u [username] -h [host] -p [database]
```

## 권한

```sql
grant all privileges on DATABASE_ICS.* to 'ics_mgr'@'%';
```

## Docker에서 접속

컨테이너에 들어간 뒤 root로 mysql을 엽니다.

```bash
docker exec -it {id} bash
mysql -u root -p
```
