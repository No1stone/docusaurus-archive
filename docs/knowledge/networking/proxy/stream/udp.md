---
title: "UDP 프록시와 응답 처리"
description: "UDP 프록시(stream) 설정과 응답 처리, DNS나 게임 트래픽에서의 주의점을 정리합니다."
slug: "/knowledge/networking/proxy/stream/udp"
sidebar_position: 3
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "UDP 프록시"
  - "stream"
  - "datagram"
  - "Nginx stream"
  - "UDP"
---

# UDP 프록시와 응답 처리

UDP는 TCP처럼 연결을 수립하고 바이트 스트림을 주고받는 방식과 다릅니다.
Nginx는 클라이언트 주소와 포트 등을 기준으로 UDP 흐름을 관리하고 업스트림으로 전달합니다.
질의 한 번에 응답 한 번이 오는 서비스와 연속 데이터그램을 보내는 서비스는 필요한 설정이 다릅니다.

## 요청과 응답 수를 아는 경우

아래는 내부 DNS 서버에 질의를 전달하는 예시입니다.
nginx.conf 최상위의 stream 문맥에 두고 로컬 테스트 포트로 접근합니다.

```nginx
stream {
    server {
        listen 5353 udp reuseport;
        proxy_pass dns.internal:53;
        proxy_responses 1;
        proxy_timeout 5s;
    }
}
```

proxy_responses는 요청당 기대하는 응답 수에 관한 힌트로 세션 종료 판단에 사용됩니다.
프로토콜마다 응답 개수와 전송 방식이 다르므로 위 값을 모든 UDP 서비스에 그대로 적용하지 않습니다.
Docker로 실행한다면 포트 매핑도 `5353:5353/udp`처럼 UDP로 공개합니다.

## 손실을 어디서 복구하는가

UDP 전달을 설정해도 메시지의 영속 보관이나 업무 ACK가 추가되지는 않습니다.
센서 데이터를 잃지 않아야 한다면 장비 프로토콜에서 재전송과 중복 식별을 구현하거나, 보관과 확인 응답을 제공하는 수집 구조를 선택합니다.
수신 서버의 지연과 프록시의 세션 타임아웃도 함께 확인합니다.

| 실습 | 관찰 |
|---|---|
| 정상 질의 | 요청과 응답이 왕복하는지 확인합니다. |
| 업스트림 종료 | 클라이언트의 대기와 재시도가 어떻게 끝나는지 봅니다. |
| 연속 요청 | 응답 수와 세션 종료 정책이 실제 프로토콜에 맞는지 봅니다. |

```bash
dig @127.0.0.1 -p 5353 example.com
```

개인 인프라에서는 Fluent Bit forward 연결 경로도 stream 대상으로 정리했습니다.
실제 로그 입력 프로토콜이 TCP인지 UDP인지와 수신 설정을 맞춰 확인합니다. [infra-dev 연결 표](https://github.com/No1stone/infra-dev#resource-server-endpoint)

지시문 의미는 [UDP listen](https://nginx.org/en/docs/stream/ngx_stream_core_module.html#listen)과 [Stream proxy](https://nginx.org/en/docs/stream/ngx_stream_proxy_module.html#proxy_responses)를 참고합니다.
