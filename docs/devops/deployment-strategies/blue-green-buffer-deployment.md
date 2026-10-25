---
id: blue-green-buffer-deployment
title: "비용최적화 BLUE-GREEN buffer 배포"
description: "단일 인스턴스 환경에서 Buffer 서버를 활용한 Blue-Green 유사 배포"
tags:
  - blue-green
  - deployment
  - nginx
  - docker-compose
  - cost-optimization
status: active
sidebar_position: 1
---

# 단일 인스턴스 환경에서의 Blue-Green 유사 배포

# (Buffer 서버 활용)

## 1. 배경

일반적인 Blue-Green 배포는 최소 2대 이상의 운영 인스턴스를 전제로 한다.

하지만 초기 서비스나 비용 제약이 있는 환경에서는
상시 이중화를 유지하기 어렵다.

이번 구조는 다음 조건에서 시작했다.

- 운영 서버: 1대 (api-collector)
- dev 서버: 1대 (개발/테스트용)
- Nginx: 별도 프록시 서버
- 센서 데이터 수신 API는 중단 없이 유지 필요

이 상황에서 “완전한 이중화” 대신
배포 시점에만 임시로 이중화를 구성하는 방식을 선택했다.

---

## 2. 문제

단일 인스턴스에서 배포 시 다음 문제가 발생한다.

```text
컨테이너 재기동 → 일정 시간 API 중단
→ 센서 데이터 수신 공백 발생
```

---

## 3. 해결 방식

dev 서버를 임시 Buffer 서버로 활용한다.

기본 구조:

```text
[Client]
   ↓
[Nginx Proxy]
   ↓
[signal (운영)]
```

배포 시:

```text
[Client]
   ↓
[dev (Buffer) 배포 및 Health Check 검증]
   ↓
[Nginx Proxy → dev(Buffer)로 트래픽 전환]
   ↓
[signal (운영) 서버 배포]
   ↓
[Nginx Proxy → signal(운영)로 트래픽 복귀]
```

---

## 4. 배포 흐름

### 1. dev 서버에 신규 버전 배포

- 운영 서버는 그대로 유지
- dev 서버에 신규 컨테이너 실행

---

### 2. Health Check 검증

```text
/actuator/health
```

- HTTP 200
- status: UP

이 단계에서 실패하면 배포 중단
운영 서버는 계속 서비스 유지

---

### 3. Nginx upstream 전환

- dev 서버가 정상일 때만 전환
- 트래픽을 dev로 변경

이 시점부터 실제 요청은 dev 서버가 처리한다.

---

### 4. 운영 서버 배포

- signal 서버 컨테이너 교체
- docker compose build / up 수행
- health check 확인

---

### 5. Nginx 복귀

- 운영 서버 정상 확인 후
- upstream을 signal로 다시 전환

---

## 5. 핵심 포인트

```text
검증된 서버로만 트래픽을 전환한다
```

- dev에서 먼저 검증
- 검증 이후에만 전환
- 배포 중에도 최소 1개 서버 유지

---

## 6. 장점

- 상시 이중화 없이도 배포 안정성 확보
- dev 서버를 활용한 비용 절감
- 구조가 단순하고 운영 부담이 적음

---

## 7. 한계

```text
Nginx 전환 순간 짧은 요청 실패 가능
Buffer 서버 장애 시 영향 발생
네트워크 이슈
```

완전한 무중단 구조는 아니지만
배포로 인한 공백은 대부분 제거할 수 있다.

---

## 8. 결론

단일 인스턴스 환경에서도
배포 순서를 분리하는 것만으로 안정성을 크게 개선할 수 있다.

```text
배포 → 검증 → 전환 → 복귀
```
