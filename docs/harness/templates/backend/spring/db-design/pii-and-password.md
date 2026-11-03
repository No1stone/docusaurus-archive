---
sidebar_position: 12
title: 개인정보와 비밀번호
description: 검색용 SHA·Salt·AES 세트와 로그인 비밀번호 SHA+Salt를 구분합니다.
---

# 개인정보와 비밀번호

> **필수 경계:** 개인정보 검색·복호화 세트와 로그인 비밀번호 해시는 규칙을 섞지 않습니다.
> 비밀번호 방식을 개인정보·일반 암호화 권장으로 확대하지 않습니다.

## 개인정보 (앞으로 적용할 규칙 · 이상적 스케치)

민감 값을 평문 한 컬럼만으로 두지 않는 것이 방향입니다.

| 저장 항목 | 목적 |
|-----------|------|
| 검색용 SHA | 동일 값 검색·조인 (원문 비복원) |
| Salt | 해시·암호 입력에 사용 |
| AES 암호문 | 필요할 때 복호화 |
| (선택) 키 식별자 | 키 교체·참조 |

컬럼 이름·길이는 업무에 맞게 정합니다.
아래는 구조만 보여주는 스케치입니다.

```text
ex_account
  id                          -- 대리키 (문자열 또는 Long, 도메인 선택)
  email_sha                   -- 검색용
  email_salt
  email_aes                   -- 복호화용 암호문
  cipher_key_id               -- 선택
  status
  created_at, created_by, …
```

검색값 정규화, 키 보관 위치 등 확인하지 않은 운영 세부는 단정하지 않습니다.

## 비밀번호 (기존 구현 설명 · 확인분)

FarmPro 회원 비밀번호는 **단방향**입니다.

| 항목 | 확인분 |
|------|--------|
| 해시 | `EncUtils.encSHA512(password, salt)` |
| Salt | `Salt.generate()` 후 `login_password_salt_key` 등에 저장 |
| 호출 예 | `MemberWebFacade` 생성·비밀번호 변경 경로 |
| AES | 로그인 비밀번호에 사용하지 않음. `EncUtils.encAES`/`decAES`는 별도 유틸 |

개인정보 AES 세트와 비밀번호 SHA+Salt는 목적이 다릅니다.
