---
title: "TCP 프록시와 부하 분산"
description: "stream으로 TCP를 부하 분산하는 upstream과 헬스, 타임아웃 설정을 예제로 봅니다."
slug: "/knowledge/networking/proxy/stream/tcp-balancing"
sidebar_position: 2
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "TCP 로드밸런싱"
  - "stream upstream"
  - "proxy_pass"
  - "Nginx stream"
---

# TCP 프록시와 부하 분산

MySQL과 RabbitMQ처럼 TCP 세션을 사용하는 서비스 앞에 Nginx를 둘 수 있습니다.
연결이 시작되면 업스트림을 선택하고 해당 TCP 세션의 데이터를 중계합니다.
DB 연결 풀을 사용하는 앱에서는 연결 하나가 오래 유지되므로 HTTP 요청별 분산과 체감 동작이 다를 수 있습니다.

## 포트별로 목적지를 지정합니다

다음 stream 블록은 nginx.conf 최상위에 둡니다.
stream 모듈이 포함되거나 로드된 Nginx가 필요하며, HTTP 문맥에서 읽는 conf.d 파일에 그대로 넣으면 문맥 오류가 납니다.
backend 이름은 실제로 접근 가능한 내부 DNS 이름으로 교체합니다.

```nginx
stream {
    upstream mysql_target {
        server mysql.internal:3306;
    }
    upstream rabbit_target {
        server rabbitmq.internal:5672;
    }

    server {
        listen 3308;
        proxy_pass mysql_target;
        proxy_connect_timeout 3s;
        proxy_timeout 10m;
    }
    server {
        listen 5673;
        proxy_pass rabbit_target;
        proxy_connect_timeout 3s;
        proxy_timeout 10m;
    }
}
```

## 연결을 분배할 때 지킬 경계

| 서비스 | 분배 전 확인할 조건 |
|---|---|
| MySQL | 쓰기 대상과 읽기 전용 복제본을 구분하고, 트랜잭션이 연결에 묶인다는 점을 확인합니다. |
| RabbitMQ | 브로커의 클러스터와 큐 배치, 클라이언트 재연결을 확인합니다. |
| Kafka | metadata에 광고되는 브로커 주소까지 클라이언트가 도달할 수 있는지 확인합니다. |

MySQL primary와 replica를 임의로 같은 풀에 넣으면 쓰기 요청이 읽기 전용 서버로 갈 수 있습니다.
TCP 프록시는 SQL을 해석해 읽기와 쓰기를 분기하지 않습니다.
Kafka 역시 bootstrap 포트 한 개를 연결한 것만으로 모든 브로커의 접속 경로가 만들어지지는 않습니다.

```bash
mysql -h 127.0.0.1 -P 3308 -u app_user -p
```

먼저 연결과 인증을 확인하고, 쿼리 실행과 연결 중단 뒤 재연결을 검사합니다.
비밀번호는 명령 인자로 직접 남기지 않고 프롬프트 등 해당 클라이언트의 입력 방식을 사용합니다.
직접 구성했던 포트 배치는 [infra-dev](https://github.com/No1stone/infra-dev#resource-server-endpoint)를 참고합니다.
TCP 전달 지시문은 [Stream proxy](https://nginx.org/en/docs/stream/ngx_stream_proxy_module.html), 서버 그룹은 [Stream upstream](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html)을 참고합니다.
