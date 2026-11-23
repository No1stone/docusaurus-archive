---
title: "TLS 패스스루와 SNI 라우팅"
description: "TLS를 종료하지 않는 패스스루와 SNI 기반 라우팅을 stream에서 구성하는 방법을 설명합니다."
slug: "/knowledge/networking/proxy/stream/tls-passthrough-sni"
sidebar_position: 4
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "TLS passthrough"
  - "SNI"
  - "ssl_preread"
  - "stream"
  - "Nginx"
---

# TLS 패스스루와 SNI 라우팅

앱이 인증서를 관리하고 TLS를 직접 종료해야 한다면 Nginx는 TCP 연결을 그대로 중계할 수 있습니다.
여러 TLS 서비스를 같은 포트에 모으려면 ClientHello에 들어 있는 SNI로 목적지를 선택하는 방법이 있습니다.
HTTP 경로는 TLS 내부에 있으므로 이 단계에서는 해석할 수 없습니다.

## SNI로 업스트림을 선택합니다

stream_ssl_preread 모듈이 포함된 구성을 가정합니다.
다음은 nginx.conf 최상위의 stream 블록이며, 각 업스트림이 TLS를 제공해야 합니다.

```nginx
stream {
    upstream api_tls {
        server api.internal:443;
    }
    upstream rabbit_tls {
        server rabbitmq.internal:5671;
    }

    map $ssl_preread_server_name $tls_target {
        api.example.com api_tls;
        mq.example.com  rabbit_tls;
        default         api_tls;
    }

    server {
        listen 443;
        ssl_preread on;
        proxy_pass $tls_target;
    }
}
```

default의 목적지도 정책으로 정합니다.
예제는 기본 TLS 서버로 보내는 선택이며, 이름을 알 수 없는 연결을 수용할지 별도로 결정합니다.
동일한 주소와 443 포트를 다른 HTTP TLS server와 동시에 중복 수신하도록 설정하지 않습니다.

## 모든 프로토콜에 적용할 수 있는가

SNI는 클라이언트가 TLS ClientHello에 보내는 정보입니다.
TLS 전에 프로토콜 인사나 협상을 수행하는 MySQL 등의 연결에는 위 예제를 그대로 적용하기 어렵습니다.
클라이언트가 어떤 순서로 통신을 시작하는지 먼저 확인합니다.
인증서 검증 대상은 최종 TLS 서버이며, Nginx가 앱 인증서를 대신 제공하지 않습니다.

```bash
openssl s_client -connect 127.0.0.1:443 -servername api.example.com
```

서버 인증서를 확인하고 다른 SNI 이름으로도 요청합니다.
SNI 없는 연결, 허용하지 않은 이름과 인증서 갱신 후 결과도 검사합니다.
패스스루 경로에서는 앱 인증서의 수명과 교체 절차를 앱 운영에 포함합니다.

ClientHello를 읽는 범위와 모듈 지원은 [ssl_preread 문서](https://nginx.org/en/docs/stream/ngx_stream_ssl_preread_module.html)를 참고합니다.
