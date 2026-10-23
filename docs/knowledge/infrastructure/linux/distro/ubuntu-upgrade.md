---
format: md
id: k-ubuntu-upgrade
title: "ubuntu upgrade"
description: "Ubuntu 배포판 업그레이드(do-release-upgrade)와 Prompt 설정 메모입니다."
tags:
  - Linux
status: active
slug: /knowledge/k-ubuntu-upgrade
---
# ubuntu upgrade

## 개요

Ubuntu 릴리스를 올리는 절차와 `release-upgrades`의 Prompt 값 메모입니다.
일반 업그레이드와 LTS만 허용하는 설정을 구분해 둡니다.

## 업그레이드

```bash
sudo apt install update-manager-core
```

```bash
sudo do-release-upgrade
```

현재 버전을 확인합니다.

```bash
lsb_release -a
```

업그레이드 Prompt 설정을 확인합니다.

```bash
cat /etc/update-manager/release-upgrades
```

## Prompt 값

일반 업그레이드:

`Prompt=normal`

LTS만 업그레이드:

`Prompt=lts`
