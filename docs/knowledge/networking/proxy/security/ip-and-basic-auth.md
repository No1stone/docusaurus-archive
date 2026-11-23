---
title: "IP 접근 제한과 Basic 인증"
description: "allow/deny IP 제한과 Basic Auth로 관리 경로를 보호하는 Nginx 설정을 설명합니다."
slug: "/knowledge/networking/proxy/security/ip-and-basic-auth"
sidebar_position: 3
tags:
  - "nginx"
  - "HTTP"
status: "active"
keywords:
  - "allow deny"
  - "Basic Auth"
  - "auth_basic"
  - "IP 제한"
  - "Nginx"
---

# IP 접근 제한과 Basic 인증

내부 관리 화면이나 임시 운영 페이지는 접근 가능한 사용자와 네트워크 범위를 정해 공개합니다.
IP 접근 제한과 Basic 인증을 함께 사용하면 관리 경로에 도달할 수 있는 범위와 인증 조건을 표현할 수 있습니다.
Basic 인증 자격 증명은 TLS로 보호되는 경로에서 사용합니다.

## IP와 계정 조건을 함께 적용합니다

```nginx
location /admin/ {
    satisfy all;
    allow 192.0.2.10;
    deny all;

    auth_basic "Operations";
    auth_basic_user_file /etc/nginx/auth/htpasswd;
    proxy_pass http://backend:8080;
}
```

`192.0.2.10`은 문서용 주소이므로 실제 허용 주소로 교체합니다.
이 예제는 허용된 주소이면서 인증도 통과해야 합니다.
satisfy any를 선택하면 IP 조건 또는 계정 조건 중 하나를 만족하는 정책으로 바뀌므로 요구사항을 먼저 확인합니다.

## 비밀번호 파일과 실제 접속 주소

비밀번호 파일은 htpasswd 같은 도구로 해시를 생성해 준비합니다.
파일을 정적 파일 제공 디렉터리 밖에 두고 Nginx 프로세스가 읽을 권한만 부여합니다.
컨테이너에서는 해당 파일을 읽기 전용으로 마운트할 수 있습니다.

ALB나 다른 프록시 뒤에서는 allow가 비교하는 클라이언트 주소가 무엇인지 확인합니다.
신뢰 범위를 잘못 설정하면 모든 사용자가 같은 프록시 주소로 보이거나 외부 입력을 믿게 될 수 있습니다.

| 요청 | 기대 결과 |
|---|---|
| 허용 주소, 올바른 계정 | 관리 화면에 접근합니다. |
| 허용 주소, 계정 누락 | 인증 요청을 받습니다. |
| 허용 범위 밖 주소 | IP 정책에 따라 거절됩니다. |

```bash
curl -i -u operator https://app.example.com/admin/
```

위 명령은 비밀번호 입력을 요청합니다.
앱에서도 관리 작업의 역할과 권한을 검사하고 접근 이력을 남깁니다.
관련 지시문은 [access 모듈](https://nginx.org/en/docs/http/ngx_http_access_module.html), [Basic 인증](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html), [satisfy](https://nginx.org/en/docs/http/ngx_http_core_module.html#satisfy)를 참고합니다.
