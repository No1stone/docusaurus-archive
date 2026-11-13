---
format: md
id: mysql-server-options-tls-connections
title: "MySQL과 MariaDB의 TLS 접속 설정"
sidebar_label: "TLS 접속"
description: "require_secure_transport와 ssl_ca, ssl_cert, ssl_key, JDBC sslMode로 서버 TLS 요구와 클라이언트 인증서·호스트 이름 검증을 구분하는 방법을 정리합니다."
slug: /knowledge/data/mysql/operations/server-options/tls-connections
sidebar_position: 11
tags:
  - MySQL
  - MariaDB
  - Database
status: active
keywords:
  - "require_secure_transport"
  - "ssl_ca"
  - "sslMode"
  - "VERIFY_IDENTITY"
  - "Ssl_cipher"
references:
  - "https://dev.mysql.com/doc/refman/8.4/en/using-encrypted-connections.html"
  - "https://mariadb.com/docs/server/security/encryption/data-in-transit-encryption/securing-connections-for-client-and-server"
  - "https://dev.mysql.com/doc/refman/8.4/en/alter-user.html"
  - "https://mariadb.com/docs/server/reference/sql-statements/account-management-sql-statements/alter-user"
  - "https://dev.mysql.com/doc/connectors/en/connector-j-connp-props-security.html"
  - "https://mariadb.com/docs/connectors/mariadb-connector-j/using-tls-ssl-with-mariadb-java-connector"
  - "https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html#statvar_Ssl_cipher"
  - "https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/system-variables/server-status-variables"
---

# MySQL과 MariaDB의 TLS 접속 설정

Spring 애플리케이션과 DB가 서로 다른 장비에 있으면 JDBC 연결이 네트워크를 지납니다.
TLS를 적용할 때는 **DB 서버가 암호화 연결을 요구하는지**, **JDBC 드라이버가 접속한 서버의 인증서와 이름을 확인하는지**를 각각 설정합니다.

## DB 서버에서 TLS 요구하기

서버 인증서를 준비한 뒤 `.cnf`의 `[mysqld]`에 설정합니다.
아래 경로는 DB 프로세스에서 읽을 수 있는 위치를 기준으로 합니다.
Docker로 실행한다면 컨테이너 안의 경로를 지정합니다.
[MySQL 암호화 연결 설정](https://dev.mysql.com/doc/refman/8.4/en/using-encrypted-connections.html), [MariaDB 보안 연결 설정](https://mariadb.com/docs/server/security/encryption/data-in-transit-encryption/securing-connections-for-client-and-server)

```ini
[mysqld]
ssl-ca = /etc/mysql/tls/ca.pem
ssl-cert = /etc/mysql/tls/server-cert.pem
ssl-key = /etc/mysql/tls/server-key.pem
require-secure-transport = ON
```

| 옵션 | 역할 |
|---|---|
| `ssl_ca` | 서버가 신뢰하는 CA 인증서 지정. 클라이언트 인증서를 검증할 때 사용 |
| `ssl_cert` | DB 서버가 클라이언트에 제시할 인증서 |
| `ssl_key` | 서버 인증서에 대응하는 개인 키 |
| `require_secure_transport` | 암호화되지 않은 TCP 접속 거부. 로컬 Unix 소켓은 허용 |

서버 전체에 적용하기 전에 특정 계정만 TLS 접속으로 제한할 수도 있습니다.
아래 명령의 호스트 부분은 실제 DB 계정에 등록된 값으로 바꿉니다.
[MySQL `ALTER USER`](https://dev.mysql.com/doc/refman/8.4/en/alter-user.html), [MariaDB `ALTER USER`](https://mariadb.com/docs/server/reference/sql-statements/account-management-sql-statements/alter-user)

```sql
ALTER USER 'appuser'@'10.0.1.25' REQUIRE SSL;
```

## JDBC에서 서버 인증서와 호스트 이름 검증하기

JDBC URL에는 드라이버에 맞는 `sslMode`를 지정합니다.
아래 예제는 서버 인증서가 신뢰할 수 있는 CA에서 발급됐는지와 접속 주소인 `db.internal`이 인증서의 이름과 일치하는지를 확인합니다.
사설 CA를 사용한다면 애플리케이션이 사용하는 신뢰 저장소에 해당 CA를 등록합니다.
[MySQL Connector/J 보안 속성](https://dev.mysql.com/doc/connectors/en/connector-j-connp-props-security.html), [MariaDB Connector/J TLS 설정](https://mariadb.com/docs/connectors/mariadb-connector-j/using-tls-ssl-with-mariadb-java-connector)

| 드라이버 | JDBC URL 예제 |
|---|---|
| MySQL Connector/J | `jdbc:mysql://db.internal:3306/app?sslMode=VERIFY_IDENTITY` |
| MariaDB Connector/J | `jdbc:mariadb://db.internal:3306/app?sslMode=verify-full` |

Compose 네트워크에서 JDBC 접속 주소로 `mysql`이나 `mariadb` 같은 서비스 이름을 쓴다면, 그 이름을 서버 인증서의 **SAN(Subject Alternative Name)**에 포함합니다.
IP로 접속한다면 인증서에도 해당 IP가 있어야 이름 검증을 통과할 수 있습니다.

## 실제 JDBC 연결에서 TLS 확인하기

```sql
SHOW GLOBAL VARIABLES LIKE 'require_secure_transport';
SHOW SESSION STATUS LIKE 'Ssl_version';
SHOW SESSION STATUS LIKE 'Ssl_cipher';
```

`require_secure_transport`는 **서버의 접속 정책**입니다.
`Ssl_version`과 `Ssl_cipher`는 **이 SQL을 실행한 연결에서 협상한 TLS 버전과 암호 스위트**를 보여 줍니다.
애플리케이션 접속을 확인하려면 Spring이 사용하는 `DataSource`에서 위 쿼리를 실행합니다.
`Ssl_cipher`에 값이 있으면 해당 연결에서 TLS를 사용 중이며, 인증서와 호스트 이름 검증 여부는 JDBC의 `sslMode`에서 확인합니다.
[MySQL TLS 상태 변수](https://dev.mysql.com/doc/refman/8.4/en/server-status-variables.html#statvar_Ssl_cipher), [MariaDB 서버 상태 변수](https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/system-variables/server-status-variables)

## 관련

- [서버 옵션](/docs/knowledge/data/mysql/operations/server-options)
- [접속과 SQL 동작](/docs/knowledge/data/mysql/operations/server-options/connection-and-sql-mode)
- [설정 확인과 변경](/docs/knowledge/data/mysql/operations/server-options/inspect-and-change)
- [MySQL과 MariaDB Compose 예제](/docs/knowledge/data/mysql/operations/docker-compose-examples)
