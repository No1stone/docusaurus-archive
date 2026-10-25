---
id: nextcloud-php-security-upgrade-retrospective
title: "PHP 보안 패치하려다 Nextcloud 5개 버전을 올렸다"
sidebar_label: "Nextcloud 업그레이드 후기"
description: "PHP 취약점 대응을 시작으로 Nextcloud 30부터 35까지 순차 업그레이드한 실제 운영 후기"
tags:
  - nextcloud
  - php
  - docker
  - security
  - devops
status: active
---

# PHP 보안 패치하려다 Nextcloud 5개 버전을 올렸다

> **운영 후기 | 2026.10.25**

보안 업데이트 하나 하려다가 생각보다 일이 커졌습니다.

처음에는 PHP 취약점 대응이 목적이었습니다.
그런데 서버에 올라간 Nextcloud를 확인해 보니 버전이 30이었습니다.

현재 사용 중인 Docker 이미지와 PHP 런타임을 살펴보니 단순히 PHP만 업데이트하는 것보다는 Nextcloud 자체를 함께 올리는 편이 낫겠다는 판단이 들었습니다.

결국 **Nextcloud 30에서 35까지 다섯 번의 메이저 업그레이드**를 진행했습니다.

결과부터 말하면, 무사히 끝났습니다.

## 처음에는 PHP만 업데이트할 생각이었다

운영 환경은 AWS EC2에 Docker Compose로 구성되어 있습니다.

Nextcloud 외에도 여러 서비스를 운영하고 있어 특정 컨테이너의 변경이 다른 서비스에 영향을 주지 않도록 관리하고 있었습니다.

기존 버전은 다음과 같았습니다.

| 구성 | 기존 버전 |
|---|---|
| Nextcloud | 30.0.17 |
| PHP | 8.3.28 |
| 실행 환경 | Docker Compose |

PHP만 새로운 버전으로 교체할 수도 있겠지만, 공식 Nextcloud 이미지는 PHP와 필요한 확장 모듈을 함께 제공합니다.

그렇다면 PHP만 별도로 교체하는 것보다 Nextcloud 공식 이미지를 업데이트하는 편이 유지보수 측면에서 더 낫습니다.

문제는 Nextcloud 버전이 꽤 오래됐다는 점이었습니다.

## 한 번에 35로 올릴 수는 없었다

Nextcloud는 메이저 버전을 순차적으로 업그레이드해야 합니다.

따라서 실제 작업은 다음 순서로 진행했습니다.

```text
30.0.17
   ↓
31.0.14
   ↓
32.0.15
   ↓
33.x
   ↓
34.0.5
   ↓
35.0.2
```

각 단계에서 Docker 이미지를 교체하고 Nextcloud의 내부 업그레이드가 끝날 때까지 기다렸습니다.

생각보다 단순한 반복 작업이었지만, 확인해야 할 부분은 분명했습니다.

```bash
docker exec -u www-data \
  nextcloud-nextcloud-1 \
  php occ status
```

이 명령이 이번 작업에서 가장 중요했습니다.

Apache가 정상적으로 실행된다고 해서 DB 마이그레이션까지 끝났다는 의미는 아니기 때문입니다.

`versionstring`과 `needsDbUpgrade`를 확인하면서 다음 단계로 진행했습니다.

## 작은 EC2에서는 기다리는 것도 운영이다

이번 작업에서 가장 체감됐던 부분은 성능이었습니다.

Nextcloud 이미지를 교체하면 단순히 컨테이너만 실행되는 것이 아닙니다.

내부적으로 애플리케이션 파일 동기화, 데이터베이스 마이그레이션, 앱 업데이트, 코드 무결성 검사 등이 이어졌습니다.

특히 다음 로그에서 시간이 꽤 걸렸습니다.

```text
Update app onlyoffice from App Store
Starting code integrity check...
```

작업이 멈춘 것처럼 보일 때도 있었지만 실제로는 프로세스가 실행되고 있었습니다.

```bash
docker top nextcloud-nextcloud-1
```

처음에는 업그레이드가 끝난 것인지, 아직 파일을 복사하고 있는 것인지 구분하기 어려웠습니다.

그러나 로그와 프로세스 상태를 함께 확인하니 진행 상황을 파악할 수 있었습니다.

**작은 서버에서 업그레이드를 진행할 때는 무작정 재시작하는 것보다 현재 무슨 작업을 하고 있는지 확인하는 편이 중요합니다.**

## PHP 버전도 자연스럽게 올라갔다

Nextcloud 공식 이미지를 순차적으로 교체하면서 PHP 버전도 함께 변경됐습니다.

초기에는 PHP 8.3.28이었습니다.

업그레이드 중간에는 PHP 8.3.36, PHP 8.4.27을 확인했고, 최종적으로 PHP 8.5.12가 적용됐습니다.

```text
PHP 8.5.12 (cli)
Zend Engine v4.5.12
with Zend OPcache v8.5.12
```

런타임을 직접 설치하거나 PHP 확장 모듈을 별도로 조합하지 않고도 공식 이미지 기반으로 전환할 수 있었습니다.

이 부분이 컨테이너 기반 운영의 장점이라고 느꼈습니다.

물론 PHP 버전만으로 모든 보안 문제가 해결됐다고 판단할 수는 없습니다.
이미지 내부 패키지와 애플리케이션 설정은 별도 점검 대상입니다.

## 경고가 있다고 모두 장애는 아니다

업그레이드 중 다음 경고도 반복적으로 나타났습니다.

```text
Warning: /var/www/html/config/redis.config.php
differs from the latest version of this image

Warning: /var/www/html/config/s3.config.php
differs from the latest version of this image
```

기존 설정 파일이 이미지에 포함된 기본 파일과 다르다는 의미입니다.

설정을 무작정 덮어쓰지 않고 기존 파일을 유지했습니다.

Apache에서도 다음 경고가 출력됐습니다.

```text
Could not reliably determine the server's
fully qualified domain name
```

이 메시지는 Apache의 전역 ServerName 설정과 관련된 경고였고, 실제 웹 서버는 정상적으로 실행됐습니다.

운영 로그에서는 **오류, 경고, 정보 메시지를 구분하는 것**도 중요합니다.

## 마지막으로 확인한 상태

최종적으로 Nextcloud 35.0.2까지 업그레이드했습니다.

```text
installed: true
version: 35.0.2.2
versionstring: 35.0.2
maintenance: true
needsDbUpgrade: false
```

이후 서비스가 정상적으로 동작하는 것도 확인했습니다.

| 항목 | 작업 전 | 작업 후 |
|---|---|---|
| Nextcloud | 30.0.17 | **35.0.2** |
| PHP | 8.3.28 | **8.5.12** |
| DB 마이그레이션 | 정상 | **정상** |
| 서비스 | 정상 | **정상** |

이제 이전 Nextcloud 이미지와 사용하지 않는 Docker 빌드 캐시를 정리하면 디스크 공간도 확보할 수 있습니다.

## 이번 작업에서 얻은 것

이번 업그레이드는 단순히 Docker 이미지 태그를 변경한 작업은 아니었습니다.

애플리케이션, PHP 런타임, 데이터베이스, 확장 앱이 함께 움직이는 시스템에서 어떤 순서로 변경해야 하는지 다시 확인하는 과정이었습니다.

특히 세 가지가 기억에 남습니다.

**첫 번째, 보안 업데이트는 애플리케이션의 수명주기와 연결됩니다.**

런타임만 최신으로 유지한다고 해서 오래된 애플리케이션의 보안 문제가 자동으로 해결되지는 않습니다.

**두 번째, 로그보다 실제 상태 검증이 중요합니다.**

`Initializing finished` 메시지가 나와도 `occ status`를 통해 데이터베이스 마이그레이션 상태까지 확인해야 합니다.

**세 번째, 작은 인프라일수록 변경 범위를 좁혀야 합니다.**

Nextcloud 컨테이너만 교체하고 다른 서비스와 데이터 볼륨을 유지한 것이 이번 작업을 단순하게 만드는 데 도움이 됐습니다.

## 관련 문서

- [Docker 기반 Nextcloud 30 → 35 업그레이드와 보안 점검](./nextcloud-docker-upgrade-30-to-35.md)
- [PHP 보안 취약점 대응을 위한 런타임 및 애플리케이션 업그레이드](../../../decisions/ADR-0009-php-security-runtime-upgrade.md)

---

## 마치며

PHP 보안 패치에서 시작한 작업이 Nextcloud 전체 업그레이드로 이어졌습니다.

예상보다 시간이 오래 걸렸지만, 오래된 애플리케이션과 런타임을 함께 정리할 수 있었다는 점에서 의미가 있었습니다.

개인적으로 이번 작업에서 가장 중요했던 것은 최신 버전 자체보다 **변경 과정에서 현재 상태를 확인하고, 다음 단계로 넘어갈 수 있는 기준을 명확히 하는 것**이었습니다.

보안 업데이트는 한 번의 작업으로 영원히 끝나는 것이 아닙니다.

앞으로는 정기적인 이미지 업데이트와 취약점 스캔을 통해 오래된 버전이 누적되지 않도록 관리할 생각입니다.
