---
format: md
id: k-grant
title: "grant"
description: "grant"
tags:
  - HTTP
status: active
slug: /knowledge/k-grant
---
# grant

## 개요

grant에 대한 메모입니다.

Mysql 8.x

![grant-1.png](/img/grant/grant-1.png)
![grant-2.png](/img/grant/grant-2.png)

## 예제·코드

```bash
create user 'smvuser'@'%' identified by 'Mintit1!';
GRANT ALL PRIVILEGES ON *.* TO 'smvuser'@'%';
flush PRIVILEGES;
```

```bash
create user 'develop'@'%' identified by '#';
```

```bash
show grants for develop;

revoke ALL privileges on *.* from develop@'%';

grant SELECT,INSERT,UPDATE,DELETE on DEMOCINNAMON.* to develop@'%';
grant SELECT on *.* to develop@'%';
grant select on ICS_CONNAMON_SOE.* to ics_mgr@'%';

GRANT ALL PRIVILEGES ON *.* TO `develop`@`%`;

flush PRIVILEGES;

update user set host = '192.168.%' where user = 'root' and host='%';

```

<details>
<summary>참고 자료</summary>

- [https://idchowto.com/mariadb-root-로그인-인증방식-변경/](https://idchowto.com/mariadb-root-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%9D%B8%EC%A6%9D%EB%B0%A9%EC%8B%9D-%EB%B3%80%EA%B2%BD/) — MariaDB 10.4버전 이상부터 적용된 unix_socket 인증방식과 기존부터 사용하던 mysql_native_password 인증방식의 차이점, 각 인증방식 별 설정 방법과 unix_socket 의 보안성
- [MariaDB root 로그인 인증방식 변경 - idchowto.com](https://idchowto.com/mariadb-root-로그인-인증방식-변경/) — MariaDB 10.4버전 이상부터 적용된 unix_socket 인증방식과 기존부터 사용하던 mysql_native_password 인증방식의 차이점, 각 인증방식 별 설정 방법과 unix_socket 의 보안성
</details>
