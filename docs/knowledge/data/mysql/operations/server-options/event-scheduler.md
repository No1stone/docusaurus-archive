---
format: md
id: mysql-server-options-event-scheduler
title: "MySQL과 MariaDB 이벤트 스케줄러 설정하기"
sidebar_label: "이벤트 스케줄러"
description: "event_scheduler와 CREATE EVENT로 주간 배치 SQL을 등록하고, 재시작 후 유지와 복제 환경에서의 활성 상태를 확인하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/event-scheduler
sidebar_position: 6
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "event_scheduler"
  - "CREATE EVENT"
  - "MySQL Event Scheduler"
  - "MariaDB Event Scheduler"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/events-configuration.html"
  - "https://mariadb.com/docs/server/server-usage/triggers-events/event-scheduler/events"
  - "https://dev.mysql.com/doc/refman/8.4/en/create-event.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/data-definition/create/create-event"
  - "https://dev.mysql.com/doc/refman/8.4/en/events-privileges.html"
  - "https://dev.mysql.com/doc/refman/8.4/en/replication-options-replica.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/data-definition/alter/alter-event"
---

# MySQL과 MariaDB 이벤트 스케줄러 설정하기

MySQL과 MariaDB의 **이벤트 스케줄러(Event Scheduler)**를 사용하면 DB에서 정해진 시간에 SQL을 실행할 수 있습니다.
`event_scheduler`는 서버에서 스케줄러를 켜는 옵션이고, `CREATE EVENT`는 실행할 SQL과 일정을 등록하는 명령입니다.
[MySQL Event Scheduler 설정](https://dev.mysql.com/doc/refman/8.4/en/events-configuration.html), [MariaDB Event Scheduler](https://mariadb.com/docs/server/server-usage/triggers-events/event-scheduler/events)

## 매주 금요일 새벽 3시에 만료된 쿠폰 갱신하기

아래 예제는 한국 시간으로 **2026년 11월 20일 금요일 오전 3시**부터 매주 실행됩니다.
실행하는 날짜에 맞춰 `STARTS`를 원하는 첫 금요일로 바꿉니다.
이벤트를 등록하는 세션의 타임존을 `+09:00`으로 지정합니다.
[MySQL `CREATE EVENT`](https://dev.mysql.com/doc/refman/8.4/en/create-event.html), [MariaDB `CREATE EVENT`](https://mariadb.com/docs/server/reference/sql-statements/data-definition/create/create-event)

```sql
SHOW GLOBAL VARIABLES LIKE 'event_scheduler';
SET GLOBAL event_scheduler = ON;

SET SESSION time_zone = '+09:00';

CREATE EVENT app.expire_coupons_weekly
    ON SCHEDULE EVERY 1 WEEK
    STARTS '2026-11-20 03:00:00'
    DO
        UPDATE app.coupon
        SET status = 'EXPIRED'
        WHERE status = 'ACTIVE'
          AND expires_at <= CURRENT_TIMESTAMP;

SHOW EVENTS FROM app;
SHOW CREATE EVENT app.expire_coupons_weekly;
```

`EVERY 1 WEEK`는 `STARTS`에 지정한 시각부터 일주일마다 반복합니다.
`SHOW EVENTS`에서 이벤트 상태와 타임존을 확인하고, `SHOW CREATE EVENT`에서 시작 시각과 실행 SQL을 확인합니다.
이벤트를 만들려면 대상 스키마에 대한 `EVENT` 권한이 필요하고, 이벤트 정의 계정에는 본문의 `UPDATE`를 실행할 권한이 필요합니다.
[MySQL 이벤트 권한](https://dev.mysql.com/doc/refman/8.4/en/events-privileges.html), [MariaDB 이벤트 개요](https://mariadb.com/docs/server/server-usage/triggers-events/event-scheduler/events)

## 재시작과 복제 환경에서 확인할 값

재시작 후에도 스케줄러를 켜 두려면 서버 설정 파일에 아래 값을 둡니다.

```ini
[mysqld]
event-scheduler = ON
```

복제 환경에서는 **쓰기 역할을 맡은 서버에서 이벤트가 실행되는지** 확인합니다.
장애 조치로 Replica를 승격했다면 `event_scheduler` 값과 개별 이벤트의 활성 상태를 함께 확인합니다.
스케줄러가 켜져 있어도 이벤트가 비활성 상태라면 실행을 시작하려면 해당 이벤트를 활성화해야 합니다.
[MySQL Replica와 예약 이벤트](https://dev.mysql.com/doc/refman/8.4/en/replication-options-replica.html), [MariaDB `ALTER EVENT`](https://mariadb.com/docs/server/reference/sql-statements/data-definition/alter/alter-event)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [설정 확인과 변경](/docs/knowledge/data/mysql/operations/server-options/inspect-and-change)
- [서버 기본값](/docs/knowledge/data/mysql/operations/server-options/server-defaults)
- [복제와 바이너리 로그](/docs/knowledge/data/mysql/operations/server-options/replication-and-binlog)
