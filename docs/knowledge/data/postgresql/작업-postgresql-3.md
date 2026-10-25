---
format: md
id: k-작업-postgresql-3
title: "작업 postgreSQL 3"
description: "작업 postgreSQL 3"
tags:
  - AWS
  - Docker
  - HTTP
  - Linux
  - PostgreSQL
status: active
slug: /knowledge/k-작업-postgresql-3
---
# 작업 postgreSQL 3

## 개요

작업 postgreSQL 3입니다.

프라이빗 복제설정

## 예제·코드

```bash

mkdir -p /home/app2-user/dockerdir/postgres-primary
mkdir -p /home/app2-user/dockerdir/postgres-standby

sudo chown -R :data-group /mnt/data
sudo chmod -R 777 /mnt/data
sudo chmod -R g+s /mnt/data
```

```bash
mkdir -p /home/app2-user/dockerdir/postgres-primary
mkdir -p /mnt/data/postgres-primary
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

cd /home/app2-user/dockerdir/postgres-primary &&
docker-compose up -d 

```

```bash

docker exec -it postgres-primary psql -U app2-user -d postgres -c "
CREATE ROLE repliuser WITH REPLICATION LOGIN PASSWORD '1234';" &&

docker exec -it postgres-primary psql -U app2-user -d postgres -c "SELECT * FROM pg_roles WHERE rolname = 'repliuser';"

```

<details>
<summary>참고 자료</summary>

- [PostgreSQL Streaming Replication Tutorial](https://www.youtube.com/watch?v=Yy0GJjRQcRQ) — 0:00 - What is Streaming Replication?2:12 - Asynchronous vs. Synchronous Replication4:45 - Hands-on - Initialise Primary Database6:14 - Configuring the P...
- [Pgpool-II Tutorial](https://www.youtube.com/watch?v=qpxKlH7DBjU&list=PLBrWqg4Ny6vVwwrxjgEtJgdreMVbWkBz0&index=1) — 0:00 - Introduction0:41 - Pgpool-II Features3:57 - Configure Pgpool-II with Streaming Replication5:04 - Setting up Streaming Replication10:57 - Configuri...
- [https://postgrespro.com/list/thread-id/2419341](https://postgrespro.com/list/thread-id/2419341)
</details>
