---
format: md
id: k-작업-postgresql
title: "작업 postgreSQL"
description: "작업 postgreSQL"
tags:
  - AWS
  - Docker
  - HTTP
  - Linux
  - PostgreSQL
status: active
slug: /knowledge/k-작업-postgresql
---
# 작업 postgreSQL

## 개요

작업 postgreSQL입니다.

private 연결후
프라이빗 복제설정

## 예제·코드

```bash
mkdir -p /home/app2-user/dockerdir/postgres-primary
touch /home/app2-user/dockerdir/postgres-primary/docker-compose.yml

echo ' 

services:
  postgres-primary:
    image: postgres:17.4
    container_name: postgres-primary
    restart: always
    environment:
      POSTGRES_USER: app2-user
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: mydatabase
    volumes:
      - /mnt/data/postgres-primary:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    
' >> /home/app2-user/dockerdir/postgres-primary/docker-compose.yml
```

```bash
mkdir -p /home/app2-user/dockerdir/postgres-standby
touch /home/app2-user/dockerdir/postgres-standby/docker-compose.yml
echo '
services:
  postgres-standby:
    image: postgres:17.4
    container_name: postgres-standby
    restart: always
    environment:
      POSTGRES_USER: app2-user
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: mydatabase
    volumes:
      - /mnt/data/postgres-standby:/var/lib/postgresql/data
    ports:
      - "5433:5432"      
' >> /home/app2-user/dockerdir/postgres-standby/docker-compose.yml
```

```bash
mkdir -p /home/app2-user/dockerdir/postgres-ha
touch /home/app2-user/dockerdir/postgres-ha/docker-compose.yml
echo '

services:
  pgpool:
    image: bitnami/pgpool:latest
    container_name: pgpool
    restart: unless-stopped
    environment:
      PGPOOL_ADMIN_USERNAME: admin
      PGPOOL_ADMIN_PASSWORD: 1234

      PGPOOL_SR_CHECK_USER: replication
      PGPOOL_SR_CHECK_PASSWORD: 1234

      PGPOOL_HEALTH_CHECK_USER: app2-user
      PGPOOL_HEALTH_CHECK_PASSWORD: 1234

      PGPOOL_BACKEND_NODES: "0:52.79.251.49:5432,1:52.79.251.49:5433"
      PGPOOL_POSTGRES_USERNAME: app2-user
      PGPOOL_POSTGRES_PASSWORD: 1234

      PGPOOL_ENABLE_LOAD_BALANCING: "no"
      PGPOOL_HEALTH_CHECK_PERIOD: 5
      PGPOOL_HEALTH_CHECK_MAX_RETRIES: 3
      PGPOOL_HEALTH_CHECK_RETRY_DELAY: 1
      PGPOOL_ENABLE_AUTO_FAILOVER: "yes"
      PGPOOL_FAILOVER_COMMAND: "/opt/bitnami/scripts/pgpool/failover.sh"

    ports:
      - "5434:5432"
' >> /home/app2-user/dockerdir/postgres-ha/docker-compose.yml

```

<details>
<summary>참고 자료</summary>

- [https://jinisbonusbook.tistory.com/entry/PostgreSQL-이중화HA-구성-방법-1-개념-및-초기-복제-구성](https://jinisbonusbook.tistory.com/entry/PostgreSQL-%EC%9D%B4%EC%A4%91%ED%99%94HA-%EA%B5%AC%EC%84%B1-%EB%B0%A9%EB%B2%95-1-%EA%B0%9C%EB%85%90-%EB%B0%8F-%EC%B4%88%EA%B8%B0-%EB%B3%B5%EC%A0%9C-%EA%B5%AC%EC%84%B1)
- [https://jinisbonusbook.tistory.com/entry/PostgreSQL-이중화HA-구성-방법-1-개념-및-초기-복제-구성](https://jinisbonusbook.tistory.com/entry/PostgreSQL-이중화HA-구성-방법-1-개념-및-초기-복제-구성)
</details>
