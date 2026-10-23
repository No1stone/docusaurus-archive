---
format: md
id: k-apt-list-update-관리
title: "apt list update 관리"
description: "Ubuntu apt 패키지 소스 목록(/etc/apt/sources.list)을 편집하는 메모입니다."
tags:
  - Linux
status: active
slug: /knowledge/k-apt-list-update-관리
---
# apt list update 관리

## 개요

Ubuntu에서 apt 저장소 목록을 직접 고칠 때 쓰는 메모입니다.
패키지 미러나 배포판 코드네임이 맞지 않을 때 `sources.list`를 확인합니다.

## 편집

```bash
sudo vi /etc/apt/sources.list
```

수정 후에는 `sudo apt update`로 목록이 정상 갱신되는지 확인합니다.
