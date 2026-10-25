---
format: md
id: k-mysql-8-x
title: "Mysql 8 x"
description: "Mysql 8 x"
tags:
  - HTTP
status: active
slug: /knowledge/k-mysql-8-x
---
# Mysql 8 x

## 개요

Mysql 8 x에 대한 메모입니다.

database 선택
‘192.168.0.1’
‘192.168.%’

## 예제·코드

```sql
use mysql;
SELECT user,authentication_string,plugin,host FROM mysql.user; 

```

```sql
create user '유저명'@'%' identified by '비밀번호'; 
```

```sql
GRANT ALL PRIVILEGES ON *.* TO '유저명'@'localhost'; 
GRANT GRANT OPTION ON *.* TO '유저명'@'localhost'; 
flush privileges;
```

<details>
<summary>참고 자료</summary>

- [[MySQL] MySQL 8.X user 생성 및 변경, 삭제하기/ create user / GRANT ALL PRIVILEGES ON / alter user / drop user / caching_sha2_password 을 mysql_native_password 로 변경하기 :: 프로그래머로 살아가기](https://lifeinprogram.tistory.com/22) — mysql 8.x user 생성 및 변경, 삭제 처리 하기 > mysql 에 접속하시고 user 테이블로 이동 하셔서 insert into user (Host,User,authentication_string,ssl_cipher,x509_issuer,x509_subject) values (
</details>
