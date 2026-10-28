---
format: md
id: k-mysql-8-x
title: "MySQL 8.0 계정 생성과 권한 관리"
sidebar_label: "계정과 권한 관리"
sidebar_position: 2
description: "MySQL 8.0에서 user@host 계정을 생성하고 GRANT, SHOW GRANTS, REVOKE로 권한을 관리하는 방법과 접속 호스트, 인증 설정을 설명합니다."
tags:
  - MySQL
  - Database
status: active
slug: /knowledge/k-mysql-8-x

keywords:
  - "MySQL 계정 생성"
  - "GRANT"
  - "SHOW GRANTS"
  - "user host"
references:
  - "https://dev.mysql.com/doc/refman/8.0/en/account-names.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/creating-accounts.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/privilege-changes.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/grant.html"
  - "https://dev.mysql.com/doc/refman/8.0/en/revoke.html"
  - "https://mariadb.com/docs/server/security/user-account-management/authentication-from-mariadb-10-4"
---
# MySQL 8.0 계정 생성과 권한 관리

MySQL 계정은 사용자 이름뿐 아니라 접속 호스트까지 포함한 `'사용자'@'호스트'`로 구분합니다.
계정은 `CREATE USER`로 만들고, 사용할 DB와 작업에 맞춰 `GRANT`로 권한을 부여합니다.
접속 문제가 생기면 계정의 호스트와 실제 적용된 권한부터 확인하는 것이 좋습니다.

아래 예제는 MySQL 8.0에서 계정 관리 권한이 있는 관리자로 실행하는 SQL입니다.
`app_db`는 준비된 예제 DB이며, IP와 비밀번호는 적용 환경에 맞게 바꿉니다.

## 사용자 이름이 같아도 접속 호스트가 다르면 별도 계정입니다

| 계정 예시 | 의미 |
|---|---|
| `'app_user'@'localhost'` | DB 서버의 로컬 접속을 위한 계정입니다. |
| `'app_user'@'192.168.0.10'` | 서버가 접속 출처를 해당 IP로 식별할 때 사용하는 계정입니다. |
| `'app_user'@'192.168.%'` | 해당 IP 패턴에서 접속할 수 있도록 지정한 계정입니다. |
| `'app_user'@'%'` | 호스트 와일드카드를 사용한 계정입니다. |

예를 들어 `'app_user'@'%'`를 만들고 `'app_user'@'localhost'`에 권한을 부여하면 서로 다른 계정을 대상으로 작업하게 됩니다.
생성, 권한 부여와 확인에 같은 계정 표기를 사용해야 합니다.

`%`와 `_`를 이용한 호스트 와일드카드는 MySQL 8.0.35부터 사용 중단 예정으로 표시되어 있습니다.
새 설정에서는 가능한 한 실제 접속 호스트나 지원되는 IP 대역 표기를 사용합니다.
계정의 호스트를 열어 두는 것과 DB 포트의 네트워크 접근 허용은 별도 설정입니다.
[계정 이름 공식 문서](https://dev.mysql.com/doc/refman/8.0/en/account-names.html)를 참고합니다.

## 계정과 현재 접속 정보 확인

관리자는 다음 SQL로 계정별 호스트와 인증 플러그인을 확인할 수 있습니다.

```sql
SELECT user, host, plugin
FROM mysql.user
ORDER BY user, host;
```

현재 세션에서 접속 정보와 실제 인증에 사용된 계정은 다음과 같이 확인합니다.

```sql
SELECT USER(), CURRENT_USER();
```

`USER()`는 클라이언트가 제시한 사용자와 접속 호스트를, `CURRENT_USER()`는 인증에 사용된 계정을 보여 줍니다.
계정별 권한은 뒤에서 설명하는 `SHOW GRANTS`로 확인합니다.

## 계정 생성과 권한 부여

예제에서는 `192.168.0.10`에서 접속하는 애플리케이션 계정을 만듭니다.

```sql
CREATE USER 'app_user'@'192.168.0.10'
IDENTIFIED BY 'Example-only-ChangeMe-42!';

GRANT SELECT, INSERT, UPDATE, DELETE
ON app_db.* TO 'app_user'@'192.168.0.10';
```

이 계정은 `app_db`의 데이터를 조회하고 변경할 수 있지만, 테이블 생성과 삭제 권한은 부여받지 않습니다.
스키마 변경이 필요한 배포 작업에는 별도 권한을 부여하거나 계정을 분리할 수 있습니다.

```sql
SHOW GRANTS FOR 'app_user'@'192.168.0.10';
```

권한을 부여한 뒤에는 해당 계정으로 접속해 필요한 작업이 가능한지 확인합니다.
전체 권한이 필요한 관리 계정이라도 `ALL PRIVILEGES ON app_db.*`와 서버 전체를 대상으로 하는 `ALL PRIVILEGES ON *.*`는 범위가 다릅니다.
다른 계정에 권한을 다시 부여하는 `WITH GRANT OPTION`도 애플리케이션 계정에 일괄 추가하지 않습니다.
[계정 생성과 권한 부여](https://dev.mysql.com/doc/refman/8.0/en/creating-accounts.html)에서 관리 범위별 예제를 확인할 수 있습니다.

## 권한 회수와 비밀번호 변경, 계정 삭제

다음은 서로 독립적인 관리 명령 예제입니다.
필요한 작업만 선택해 실행합니다.

```sql
-- 삭제 권한만 회수합니다.
REVOKE DELETE ON app_db.* FROM 'app_user'@'192.168.0.10';

-- 비밀번호를 변경합니다.
ALTER USER 'app_user'@'192.168.0.10'
IDENTIFIED BY 'Another-example-ChangeMe-42!';

-- 사용하지 않는 계정을 삭제합니다.
DROP USER 'app_user'@'192.168.0.10';
```

`CREATE USER`, `GRANT`, `REVOKE`, `ALTER USER` 같은 계정 관리 문장을 실행한 뒤에는 별도의 `FLUSH PRIVILEGES`가 필요하지 않습니다.
이미 연결된 세션에 변경이 반영되는 시점은 권한 종류에 따라 다르므로 새 연결에서도 확인합니다.
`mysql.user`를 직접 수정하는 대신 계정 관리 문장을 사용합니다.
[권한 변경 적용 시점](https://dev.mysql.com/doc/refman/8.0/en/privilege-changes.html)을 참고합니다.

## 인증 플러그인과 제품 버전 확인

MySQL 8.0은 기본 인증 플러그인으로 `caching_sha2_password`를 사용합니다.
접속 오류가 발생했다고 바로 `mysql_native_password`로 변경하기보다, 드라이버의 지원 버전과 TLS 등 연결 설정을 먼저 확인합니다.
두 플러그인의 지원 상태는 MySQL 버전에 따라 다릅니다.
[MySQL 8.0 인증 플러그인](https://dev.mysql.com/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html)에서 조건을 확인할 수 있습니다.

MariaDB는 MySQL에서 분기되었지만 인증 구성이 같지는 않습니다.
특히 MariaDB 10.4의 기본 로컬 관리자 인증에는 `unix_socket`이 사용되므로 MySQL용 비밀번호 변경 예제를 그대로 적용하지 않습니다.
소켓 연결과 소켓 인증의 차이는 [MySQL 소개](/docs/knowledge/data/mysql#mysql과-mariadb는-어떤-관계인가요)에서 설명합니다.

## 관련 문서

- [MySQL Docker 배포와 데이터 보존](/docs/knowledge/data/mysql/operations/docker-and-persistence)

- [MySQL이란?](/docs/knowledge/data/mysql)
- [MySQL CLI](/docs/knowledge/k-mysql-cli)

<details>
<summary>참고 자료</summary>

- [MySQL 8.0 GRANT](https://dev.mysql.com/doc/refman/8.0/en/grant.html)
- [MySQL 8.0 REVOKE](https://dev.mysql.com/doc/refman/8.0/en/revoke.html)
- [MariaDB 10.4 인증 변경](https://mariadb.com/docs/server/security/user-account-management/authentication-from-mariadb-10-4)
- [MySQL 8.x 계정 생성과 변경 예제](https://lifeinprogram.tistory.com/22)

</details>
