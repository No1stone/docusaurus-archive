---
format: md
id: k-envvarialbe
title: "envVarialbe"
description: "Linux 공통, 사용자 환경변수 위치와 export 적용 메모"
tags:
  - Java
  - Linux
status: active
slug: /knowledge/k-envvarialbe
---
# envVarialbe

> **개요:** 환경변수를 확인하고, 시스템, 사용자 설정 파일에 넣는 위치를 적어 둔 메모입니다.
> 원 제목 철자(envVarialbe)는 그대로 둡니다.

## 환경변수 확인

```bash
env
```

## 공통 환경변수

```bash
cd /etc
# /etc/profile, /etc/bashrc 등을 확인
```

## 사용자 환경변수

홈 디렉터리의 다음 파일을 확인합니다.

- `~/.bashrc`
- `~/.bash_profile`
- `~/.bash_logout`

안전하게 `vi`로 맨 아래에 작성합니다.

```bash
export JAVA_HOME=/witch
```

(` /witch` 는 원 노트에 적힌 경로 예입니다. 실제 JDK 경로로 바꿉니다.)

적용:

```bash
source ~/.bashrc
```
