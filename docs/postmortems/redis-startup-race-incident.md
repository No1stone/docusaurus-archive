---
id: redis-startup-race-incident
title: Redis 준비 지연에 따른 애플리케이션 기동 장애 대응
description: 재배포 시 Redis보다 애플리케이션이 먼저 기동되며 연결에 실패한 운영 사례
tags:
  - postmortem
  - Redis
  - Spring
  - operations
status: active
draft: true
slug: "/postmortems/redis-startup-race-incident"
---
# Redis 준비 지연에 따른 애플리케이션 기동 장애 대응

> **개요:** 재배포 과정에서 Redis 준비가 끝나기 전에 Spring 애플리케이션이 연결을 시도해 기동에 실패한 사례입니다.

## 문제 상황

인프라 쪽 WAF 작업이 끝난 뒤 서비스를 다시 배포하는 과정에서, 애플리케이션 기동 오류가 났습니다.
서버 간 통신은 되는 상태에서도 Redis 연결 오류가 보였습니다.

## 확인 과정

재배포 순서를 보면 Redis가 Spring 애플리케이션보다 늦게 배포·준비되고 있었습니다.
애플리케이션이 Redis 준비가 끝나기 전에 연결을 시도한 것으로 보였습니다.
배포·기동 순서에 따른 레이스 컨디션으로 이해했습니다.

## 조치

Redis에 의존하는 Spring 서버를 다시 배포·기동했습니다.

## 재발 방지

인프라 배포 절차에 체크리스트를 추가해, 의존 서비스 준비 순서를 확인하도록 했습니다.
