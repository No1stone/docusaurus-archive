---
id: https-on-alb-with-acm
title: ACM과 ALB로 HTTPS 트래픽 받기
description: ACM 인증서 검증 후 ALB와 Route 53 별칭으로 HTTPS를 구성하는 흐름
tags:
  - AWS
  - HTTPS
  - DNS
  - ALB
status: active
slug: /knowledge/https-on-alb-with-acm
---
# ACM과 ALB로 HTTPS 트래픽 받기

## 개요

ACM 인증서 검증 후 ALB와 Route 53 별칭으로 HTTPS를 구성하는 흐름입니다.

1. ACM에서 인증서를 요청하고 DNS로 도메인을 검증합니다.
2. ALB를 만들고 인증서를 연결합니다.
3. 필요하면 리스너 규칙을 관리합니다.
4. HTTP(80)에서 HTTPS(443)로 리다이렉트합니다.
5. Route 53에서 ALB를 가리키는 별칭(alias) 레코드를 만듭니다.
6. 뒤쪽 nginx 등이 80으로 받더라도, 외부에서는 443으로 들어오게 맞춥니다.
ACM이 발급한 CNAME을 DNS 영역에 넣어야 인증서가 발급·갱신됩니다.
Route 53을 쓰면 콘솔의 “Route 53에서 레코드 생성”으로 레코드를 만들 수 있습니다.
다른 DNS를 쓰면 ACM이 준 Name/Value를 직접 등록합니다.
검증이 끝나기 전에는 ALB 리스너에 인증서를 붙여도 HTTPS가 기대대로 동작하지 않을 수 있습니다.
자세한 절차와 제한은 AWS 문서를 따릅니다.
ALB를 만든 뒤 HTTPS 리스너(보통 443)에 검증된 ACM 인증서를 연결합니다.

![ACM에서 Route 53으로 DNS 검증 레코드 생성](/img/https-on-alb-with-acm/acm-dns-validation.png)
![ALB 리스너 Actions 메뉴](/img/https-on-alb-with-acm/alb-listener-actions.png)
![HTTP 80에서 HTTPS 443으로 301 리다이렉트 규칙](/img/https-on-alb-with-acm/http-to-https-redirect-rule.png)
![Route 53에서 ALB 별칭 A 레코드 설정](/img/https-on-alb-with-acm/route53-alias-to-alb.png)

<details>
<summary>참고 자료</summary>

- [ACM DNS validation](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html) — Use a DNS record to validate your ownership of the domain for which you are requesting an ACM certificate.
</details>
