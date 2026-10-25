---
format: md
id: k-filename-date
title: "fileName date"
description: "date 포맷과 타임스탬프를 붙인 JAR 이름 변경 메모"
tags:
  - Linux
status: active
slug: /knowledge/k-filename-date
---
# fileName date

> **개요:** `date`로 시각 문자열을 만들고, 파일 이름에 붙여 백업, 구분하는 메모입니다.

## 연도만

```bash
date +%Y
```

## 파일 이름에 시각 붙이기

원 노트 의도: `name.jar` 앞에 시각을 붙입니다.
포맷은 `%Y%m%d%H%M` 형태가 맞습니다.

```bash
mv name.jar $(date '+%Y%m%d%H%M')_name.jar
```
