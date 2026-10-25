---
format: md
id: k-apt-update-err
title: "apt update err"
description: "apt update 오류 시 sources.list.d 추가 소스를 확인하고 제거하는 메모입니다."
tags:
  - Linux
status: active
slug: /knowledge/k-apt-update-err
---
# apt update err

## 개요

`apt update`가 실패할 때 `/etc/apt/sources.list.d/`에 있는 추가 소스 파일을 점검하는 기록입니다.
문제가 되는 파일을 제거한 뒤 다시 갱신을 시도합니다.

## 확인

```bash
sudo su
cd /etc/apt/sources.list.d/
ls
```

## 문제 파일 제거

```bash
rm <file>
```

`<file>`에는 오류를 유발하는 목록 파일 이름을 넣습니다.
삭제 전에 원본을 백업해 두면 복구가 쉽습니다.
