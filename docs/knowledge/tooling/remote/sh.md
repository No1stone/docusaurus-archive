---
format: md
id: k-sh
title: "sh"
description: "셸 스크립트 생성, 실행 권한, 실행 방법 메모"
tags:
  - Linux
status: active
slug: /knowledge/k-sh
---
# sh

> **개요:** `.sh` 스크립트를 만들고 실행 권한을 준 뒤 실행하는 메모입니다.

## 생성과 권한

실행 권한이 필요합니다.
원 노트에는 `chomd`로 적혀 있었고, 실제 명령은 `chmod`입니다.

```bash
touch {filename}.sh
chmod 777 {filename}.sh
```

운영에서는 `755` 등 더 좁은 권한이 일반적입니다.

## 실행

```bash
./{filename}.sh
```

또는:

```bash
sh {filename}.sh
```
