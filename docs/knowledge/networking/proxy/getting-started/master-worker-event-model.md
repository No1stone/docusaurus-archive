---
title: "master와 worker, 이벤트 기반 처리"
description: "Nginx master와 worker 프로세스, 이벤트 기반 연결 처리가 동시 요청에 어떻게 동작하는지 설명합니다."
slug: "/knowledge/networking/proxy/getting-started/master-worker-event-model"
sidebar_position: 2
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "master worker"
  - "worker process"
  - "이벤트 기반"
  - "Nginx"
  - "동시 연결"
---

# master와 worker, 이벤트 기반 처리

Nginx를 실행하면 master와 worker 프로세스가 보입니다.
master는 설정을 읽고 worker를 관리하며, 실제 연결 처리는 worker가 담당합니다.
worker는 이벤트 기반으로 여러 연결의 읽기와 쓰기를 처리합니다.

## 연결 하나가 늘어날 때 무엇이 늘어나는가

클라이언트 연결에는 소켓, 버퍼와 파일 디스크립터 등의 자원이 필요합니다.
프록시 요청에서는 업스트림으로 나가는 연결도 생깁니다.
WebSocket이나 SSE를 오래 유지하면 요청 수가 낮아도 유지 중인 연결 수가 커질 수 있습니다.

```nginx
# nginx.conf 최상위 문맥
worker_processes auto;

events {
    worker_connections 1024;
}
```

이 값은 worker마다 관리하는 연결 수의 한도입니다.
앱으로 연결하는 프록시 구성에서는 사용자 연결 수가 설정값의 곱과 정확히 같아지지 않습니다.
파일 디스크립터 제한, 업스트림 연결, 메모리와 CPU도 함께 영향을 줍니다.

| 관찰값 | 확인할 이유 |
|---|---|
| 활성 연결 수 | 유휴 연결과 장기 연결의 규모를 봅니다. |
| 프로세스별 열린 파일 | OS 제한에 가까워지는지 봅니다. |
| CPU와 응답 지연 | TLS 처리나 압축을 포함한 실제 병목을 확인합니다. |

## reload에서 worker가 바뀝니다

설정을 reload하면 새 worker가 새 설정으로 요청을 받기 시작합니다.
기존 worker는 새 연결 수신을 멈추고 처리 중인 요청을 마친 뒤 종료합니다.
장기 연결이 많은 서버에서는 기존 worker가 오래 남아 있을 수 있습니다.
`worker_shutdown_timeout`을 사용한다면 제한 시간이 지난 뒤 남은 연결이 닫힐 수 있으므로 클라이언트 재연결까지 확인합니다.

```bash
ps -eo pid,ppid,args | rg 'nginx: (master|worker)'
```

reload 전후에 프로세스 목록과 SSE 연결을 함께 관찰하면 설정 적용과 연결 종료가 서로 다른 사건임을 볼 수 있습니다.
성능 수치는 실제 TLS, 요청 크기, 업스트림 동작을 포함한 환경에서 측정합니다.

프로세스와 종료 설정은 [Nginx core 모듈](https://nginx.org/en/docs/ngx_core_module.html), reload의 흐름은 [공식 제어 문서](https://nginx.org/en/docs/control.html)를 참고합니다.
