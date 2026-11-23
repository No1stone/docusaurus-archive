---
title: "로그 로테이션과 컨테이너 로그 수집"
description: "로그 로테이션과 컨테이너 stdout 수집을 함께 쓸 때의 보관과 권한 이슈를 정리합니다."
slug: "/knowledge/networking/proxy/observability/log-rotation"
sidebar_position: 6
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "로그 로테이션"
  - "logrotate"
  - "stdout"
  - "Nginx 로그"
---

# 로그 로테이션과 컨테이너 로그 수집

로그를 파일로 쌓으면 보관과 교체가 필요합니다.
컨테이너의 표준 출력으로 남겨도 런타임의 로그 파일이 계속 커질 수 있습니다.
어느 계층이 보관 용량과 수집을 담당하는지 먼저 정합니다.

## 호스트 파일 로그의 교체

파일을 이름만 바꾸면 Nginx가 기존 파일 디스크립터에 계속 쓸 수 있습니다.
호스트 설치의 logrotate 설정은 로그 파일을 교체한 뒤 reopen 신호를 보내 새 파일을 열도록 구성합니다.
Ubuntu 패키지에 이미 설정이 있다면 같은 경로에 중복 로테이션을 추가하기 전에 확인합니다.

```bash
sudo nginx -s reopen
sudo ls -lh /var/log/nginx/
```

copytruncate는 복사와 잘라내기 사이에 로그가 유실될 수 있으므로 파일 reopen 방식과 운영 조건을 비교합니다.
권한과 소유자가 바뀌면 새 파일에 쓰지 못할 수 있어 교체 뒤 실제 요청을 보내 확인합니다.

## Compose 표준 출력 로그 제한

```yaml
services:
  nginx:
    image: nginx:stable-alpine
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

기존 Compose의 nginx 서비스에 logging 부분을 추가하는 예제입니다.
런타임 설정 변경은 컨테이너 재생성 여부와 적용 결과를 확인합니다.
이 값은 디스크 사용량을 제한하는 선택이며 장기 보관은 별도 수집 저장소에서 담당할 수 있습니다.

| 운영 항목 | 확인 |
|---|---|
| 로컬 보관 | 장애 동안 필요한 로그가 남는 기간과 용량을 정합니다. |
| 중앙 수집 | Fluent Bit 등 수집기의 전송 지연과 재시도 버퍼를 확인합니다. |
| 민감 정보 | 토큰, Cookie와 요청 본문의 수집 범위를 제한합니다. |
| 시간대 | UTC 또는 명시적 오프셋으로 다른 서버 로그와 대조합니다. |

개인 인프라의 Fluent Bit와 OTel 구성은 [infra-dev 리소스 디렉터리](https://github.com/No1stone/infra-dev/tree/main/docker/resource)에 연결되어 있습니다.
로그 reopen은 [Nginx 제어 문서](https://nginx.org/en/docs/control.html), 컨테이너 로테이션은 [Docker json-file 로그 드라이버](https://docs.docker.com/engine/logging/drivers/json-file/)를 참고합니다.
