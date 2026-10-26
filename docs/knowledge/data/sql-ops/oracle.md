---
format: md
id: k-oracle
title: "oracle"
description: "oracle"
tags:
  - Docker
  - Git
  - HTTP
status: active
slug: /knowledge/k-oracle
---
# oracle

## 개요

oracle에 대한 메모입니다.

도커에서 볼륨 접속할수 있게 필수로 줘야함
접속 커널은 공식문서참조

## 예제·코드

```bash
chomd 0+w -R oradata
```

```sql
docker exec -it {containerId} sqlplus sys/oracle@//localhost:1521/ORCL as sysdba
```

```bash
CREATE TABLESPACE VCS_D_ADM datafile 'table space file path' size 500M;
```

<details>
<summary>참고 자료</summary>

- [docker-images/OracleDatabase/SingleInstance at main · oracle/docker-images · GitHub](https://github.com/oracle/docker-images/tree/main/OracleDatabase/SingleInstance) — Official source of container configurations, images, and examples for Oracle products and projects - docker-images/OracleDatabase/SingleInstance at main · oracle/docker-images
- [Database Software Downloads | Oracle 대한민국](https://www.oracle.com/kr/database/technologies/oracle-database-software-downloads.html#19c) — Download the latest Database Software 26ai or all previous versions Windows, Linux Oracle Solaris, IBM AIX, HP-UX and more.
- [Oralce19c Docker 설치 :: 모두의 지식 저장고](https://growupcoding.tistory.com/18) — 1.Docker Image 다운로드 우선 Docker 환경에서 오라클을 설치 하려면 오라클 이미지가 준비 되어있어야 겠죠? 아래 GitHub 에서 Oracle19c 이미지를 다운로드 받습니다. https://github.com/oracle/ git clone https://github.com/oracle/docker-im
</details>
