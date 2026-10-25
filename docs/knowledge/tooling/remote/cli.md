---
format: md
id: k-cli
title: "cli"
description: "Rocky Linux 관리자 가이드의 Linux 명령어 입문 장 링크 메모입니다."
tags:
  - Linux
  - CLI
status: active
slug: /knowledge/k-cli
---
# cli

## 개요

Rocky Linux 관리자 가이드의 Linux 명령어 입문 장 링크 메모입니다.

> 디렉터리 이동, 파일 보기·수정, 자주 쓰는 명령의 학습 목표를 안내합니다.
Rocky Linux Admin Guide의 Commands for Linux Users 장은 예비 관리자가 다음을 익히도록 합니다.
- 시스템 트리 안에서 이동하기
- 텍스트 파일을 만들고 내용을 보고 수정하기
- 유용한 Linux 명령을 쓰기
그래픽 도구만으로 관리하지 않는 이유로, 배포판 공통 명령, 비상시 셸, SSH 원격 관리, 서버에서 GUI 생략, 스크립트 자동화를 듭니다.
사용자는 `/etc/passwd` 등에 login, UID, GID, 셸, 홈 디렉터리로 정의됩니다.
프롬프트는 관리자 `#`, 일반 사용자 `$`로 구분하는 경우가 많습니다.
기본 셸로 Bash(`/bin/bash`)가 흔합니다.
셸은 프롬프트 표시 → 명령 읽기 → 구문 분석 → 특수 문자 치환 → 실행을 반복합니다.
명령 형태는 보통 다음과 같습니다.
Ctrl+C로 실행 중 명령을 중단할 수 있습니다.

## 예제·코드

```bash
command [option(s)] [argument(s)]
```

<details>
<summary>참고 자료</summary>

- [Linux Commands - Rocky Linux Documentation](https://docs.rockylinux.org/books/admin_guide/03-commands/)
</details>
