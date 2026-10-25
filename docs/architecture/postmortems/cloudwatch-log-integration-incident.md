---
id: cloudwatch-log-integration-incident
title: CloudWatch 로그 연동 장애 대응
description: CloudWatch용 IAM 액세스 키 사용 제한 이후 로그 연동 오류에 대응한 운영 사례
tags:
  - postmortem
  - AWS
  - CloudWatch
  - operations
status: active
draft: true
slug: "/postmortems/cloudwatch-log-integration-incident"
---
# CloudWatch 로그 연동 장애 대응

> **개요:** CloudWatch 로그 연동이 깨진 상황에서 알림을 확인하고 키를 교체한 뒤, 알림 수신 범위를 넓힌 운영 대응입니다.

## 문제 상황

CloudWatch용 IAM 액세스 키에 대한 의심스러운 접근 시도와 관련해, AWS의 키 사용 제한 조치가 있었습니다.
그 결과 CloudWatch 로그 연동에서 오류가 발생했습니다.

## 확인 과정

팀 메일로 관련 알림이 온 것을 발견했습니다.
아침마다 메일을 확인하는 습관으로 알림을 빠르게 인지한 편이었습니다.
내용을 정리해 담당 팀장에게 보고했습니다.

## 조치

해당 IAM 액세스 키를 교체했습니다.
로그 연동이 다시 동작하도록 맞췄습니다.

## 재발 방지

이후 비슷한 알림이 빠지지 않도록, AWS 메일 수신 대상에 인프라팀 외 인원을 추가했습니다.
