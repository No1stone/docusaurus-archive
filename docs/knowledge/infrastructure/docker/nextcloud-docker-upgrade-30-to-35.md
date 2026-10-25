---
id: nextcloud-docker-upgrade-30-to-35
title: "Docker 기반 Nextcloud 30 → 35 업그레이드와 보안 점검"
sidebar_label: "Nextcloud Docker 업그레이드"
description: "Docker Compose 환경에서 Nextcloud 30부터 35까지 순차 업그레이드하고 PHP 버전, 데이터베이스 마이그레이션, Docker 리소스를 점검한 운영 기록"
tags:
  - Docker
  - Nextcloud
  - PHP
  - DevOps
  - Security
  - AWS
status: active
---

# Docker 기반 Nextcloud 30 → 35 업그레이드와 보안 점검

> **운영 기록 | 2026.10.25**
>
> AWS EC2, Docker Compose, Nextcloud, PHP, Apache

오랫동안 운영해 온 Nextcloud 컨테이너의 보안 업데이트를 진행했습니다.

기존 환경은 Nextcloud 30과 PHP 8.3 기반이었습니다.
단순히 Docker 이미지를 최신 버전으로 변경하면 끝날 것 같지만, Nextcloud는 메이저 버전별로 데이터베이스와 애플리케이션 마이그레이션을 수행해야 합니다.

이번 작업에서는 **Nextcloud 30부터 35까지 순차적으로 업그레이드**하고, 서비스 정상 동작을 확인한 뒤 오래된 Docker 이미지를 정리했습니다.

---

## 1. 운영 환경

| 구분 | 구성 |
|---|---|
| 인프라 | AWS EC2 |
| 컨테이너 | Docker / Docker Compose |
| 애플리케이션 | Nextcloud |
| 웹 서버 | Apache |
| 런타임 | PHP |
| 데이터베이스 | 외부 MySQL 컨테이너 |
| 기타 연동 | OnlyOffice, Calendar 등 |

기존 서버에는 Nextcloud 외에도 여러 서비스가 Docker로 운영되고 있었습니다.

따라서 Nextcloud만 교체하고 다른 컨테이너나 데이터 볼륨에는 영향을 주지 않는 방식으로 진행했습니다.

### 업그레이드 결과

| 구성요소 | 이전 | 이후 |
|---|---|---|
| Nextcloud | 30.0.17 | **35.0.2** |
| PHP | 8.3.28 | **8.5.12** |
| Apache | 기존 이미지 버전 | **2.4.69** |
| DB 마이그레이션 | 정상 | **정상 완료** |
| 서비스 | 정상 | **정상 동작 확인** |

## 2. Nextcloud 업그레이드 전략

Nextcloud는 여러 메이저 버전을 건너뛰는 업그레이드를 지원하지 않습니다.

따라서 다음 순서로 진행했습니다.

```text
Nextcloud 30
    │
    ▼
Nextcloud 31
    │
    ▼
Nextcloud 32
    │
    ▼
Nextcloud 33
    │
    ▼
Nextcloud 34
    │
    ▼
Nextcloud 35
```

각 단계에서 다음 조건을 확인했습니다.

- 컨테이너 초기화 완료
- Nextcloud 버전 변경 확인
- 데이터베이스 업그레이드 완료
- Apache 정상 실행
- 다음 버전으로 진행 가능한 상태인지 확인

:::caution 운영 환경 주의
실제 운영 서비스라면 업그레이드 전 데이터베이스와 Nextcloud 데이터 볼륨을 백업하고 복원 절차까지 검증하는 것이 좋습니다.
이번 작업은 별도의 테스트 성격이 있는 소규모 환경에서 진행했습니다.
:::

## 3. Docker Compose 이미지 변경

기존 Compose 설정은 다음과 같았습니다.

```yaml
services:
  nextcloud:
    image: nextcloud:30
    ports:
      - "8066:80"
    volumes:
      - ./nextcloud_config:/var/www/html/config
      - ./nextcloud_apps:/var/www/html/custom_apps
      - ./nextcloud_data:/var/www/html/data
```

실제 환경에서는 PHP 커스텀 설정도 별도 마운트하고 있었습니다.

업그레이드 시에는 이미지 태그만 다음 메이저 버전으로 변경했습니다.

예를 들어 Nextcloud 34에서 35로 업그레이드하는 경우입니다.

```bash
sudo sed -i \
  's|image: nextcloud:34-apache|image: nextcloud:35-apache|' \
  docker-compose.yml
```

설정이 정상적으로 변경됐는지 확인합니다.

```bash
grep 'image:' docker-compose.yml
```

이미지를 내려받고 Nextcloud 컨테이너만 교체합니다.

```bash
docker-compose pull nextcloud

docker-compose up -d --no-deps nextcloud
```

`--no-deps` 옵션을 사용해 다른 서비스가 불필요하게 재생성되는 것을 방지했습니다.

## 4. 업그레이드 진행 과정 확인

Nextcloud 공식 Docker 이미지는 시작 과정에서 애플리케이션 파일을 동기화하고 필요한 업그레이드를 수행합니다.

실시간 로그는 다음 명령으로 확인했습니다.

```bash
docker logs -f --tail 100 nextcloud-nextcloud-1
```

업그레이드 중에는 다음과 같은 로그가 나타났습니다.

```text
Update app drawio from App Store
Update app onlyoffice from App Store

Starting code integrity check...
Finished code integrity check

Update successful
Maintenance mode is kept active
Resetting log level
```

이후 컨테이너 초기화가 완료됐습니다.

```text
Initializing finished

Apache/2.4.69 (Debian)
PHP/8.5.12 configured
-- resuming normal operations
```

작은 EC2 인스턴스에서는 파일 동기화와 무결성 검사에 시간이 꽤 소요됐습니다.

진행 상태가 궁금하다면 컨테이너 내부 프로세스도 확인할 수 있습니다.

```bash
docker top nextcloud-nextcloud-1
```

`rsync`나 업그레이드 프로세스가 실행 중이라면 작업이 끝날 때까지 기다리는 것이 안전합니다.

## 5. 데이터베이스 마이그레이션 확인

Apache가 실행됐다고 해서 업그레이드가 완전히 성공했다고 단정할 수는 없습니다.

가장 중요한 확인 명령은 다음과 같습니다.

```bash
docker exec -u www-data \
  nextcloud-nextcloud-1 \
  php occ status
```

최종 결과는 다음과 같았습니다.

```text
installed: true
version: 35.0.2.2
versionstring: 35.0.2
maintenance: true
needsDbUpgrade: false
productname: Nextcloud
extendedSupport: false
```

여기서 확인해야 할 항목은 세 가지입니다.

| 항목 | 의미 |
|---|---|
| `versionstring` | 실제 적용된 Nextcloud 버전 |
| `maintenance` | 유지보수 모드 활성화 여부 |
| `needsDbUpgrade` | DB 마이그레이션 필요 여부 |

`needsDbUpgrade: false`를 확인한 후 다음 단계로 진행했습니다.

## 6. PHP 런타임 버전 확인

Nextcloud 업그레이드 과정에서 PHP 버전도 변경됐습니다.

```bash
docker exec nextcloud-nextcloud-1 php -v
```

최종 확인 결과:

```text
PHP 8.5.12 (cli)
Zend Engine v4.5.12
with Zend OPcache v8.5.12
```

기존 PHP 8.3 계열에서 PHP 8.5 계열로 전환된 것입니다.

다만 **PHP 버전이 최신이라고 해서 모든 보안 취약점이 해결됐다고 볼 수는 없습니다.**

애플리케이션, 확장 모듈, 운영체제 패키지, 컨테이너 이미지까지 함께 확인해야 합니다.

## 7. 유지보수 모드 해제 및 서비스 검증

최종 업그레이드 완료 후 유지보수 모드를 해제했습니다.

```bash
docker exec -u www-data \
  nextcloud-nextcloud-1 \
  php occ maintenance:mode --off
```

상태를 다시 확인합니다.

```bash
docker exec -u www-data \
  nextcloud-nextcloud-1 \
  php occ status
```

이때 목표 상태는 다음과 같습니다.

```text
versionstring: 35.0.2
maintenance: false
needsDbUpgrade: false
```

실제 서비스에서도 정상 동작을 확인했습니다.

## 8. Nextcloud 보안 점검

업그레이드 이후에는 내장 점검 명령을 활용할 수 있습니다.

```bash
# 서버 설정 점검
docker exec -u www-data \
  nextcloud-nextcloud-1 \
  php occ setupchecks

# 추가 업데이트 확인
docker exec -u www-data \
  nextcloud-nextcloud-1 \
  php occ update:check

# 설치 앱 확인
docker exec -u www-data \
  nextcloud-nextcloud-1 \
  php occ app:list
```

이 단계에서는 OnlyOffice, Calendar, Collectives 등 설치된 앱의 호환성도 확인해야 합니다.

컨테이너 이미지의 운영체제 패키지 취약점은 별도의 이미지 스캐너로 확인하는 것이 좋습니다.

## 관련 문서

- [PHP 보안 취약점 대응을 위한 런타임 및 애플리케이션 업그레이드](../../../decisions/ADR-0009-php-security-runtime-upgrade.md)
- [PHP 보안 패치하려다 Nextcloud 5개 버전을 올렸다](./nextcloud-php-security-upgrade-retrospective.md)
