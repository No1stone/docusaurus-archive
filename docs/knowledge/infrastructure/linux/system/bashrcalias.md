---
format: md
id: k-bashrcalias
title: "bashrc(alias)"
description: "~/.bashrc에 alias를 추가하고 source로 적용하는 메모"
tags:
  - Linux
status: active
slug: /knowledge/k-bashrcalias
---
# bashrc(alias)

> **개요:** 사용자 `~/.bashrc`에 alias를 넣어 명령을 짧게 쓰는 메모입니다.

## 위치

`/home/user/.bashrc` (실제 홈 디렉터리에 맞게 바꿉니다).

파일 하단에 작성합니다.

```bash
alias {name}='{code}'
```

## 확인, 편집

숨김 파일 목록:

```bash
ls -a
```

편집:

```bash
vi ~/.bashrc
```

적용:

```bash
source ~/.bashrc
```
