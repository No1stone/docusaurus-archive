---
format: md
id: knowledge-dev-ops-policies
title: "개발과 운영 정책"
sidebar_label: "개발과 운영 정책"
description: "웹 서비스 공개 전에 개인정보 동의, 이용약관, 오픈소스 고지, SBOM을 화면과 백엔드, 배포 산출물에 맞춰 확인할 때의 공통 인덱스입니다."
slug: /knowledge/dev-ops-policies
sidebar_position: 6
tags:
  - Knowledge
  - Policy
status: active
keywords:
  - "개발과 운영 정책"
  - "개인정보 동의 설계"
  - "서비스 이용약관"
  - "오픈소스 라이선스 고지"
  - "SBOM"
---

# 개발과 운영 정책

웹 서비스를 공개하려면 가입 화면에서 어떤 동의를 받을지, 유료 플랜을 해지하면 기존 데이터는 어떻게 처리할지, 외부 라이브러리를 어떤 조건으로 배포할지 정해야 합니다.
이런 결정은 화면 문구와 백엔드 동작, 배포 산출물에 각각 반영됩니다.

| 확인할 일 | 읽을 글 |
|---|---|
| 수집하는 개인정보와 사용자 선택을 설계합니다. | [개인정보 처리방침과 동의 설계](/docs/knowledge/service-policy/privacy-consent-design) |
| 처리방침 문구를 실제 데이터 흐름에 맞춰 작성합니다. | [개인정보 처리방침 예시 템플릿](/docs/knowledge/service-policy/privacy-policy-template) |
| 서비스 이용 조건을 정하고 개정 내용을 적용합니다. | [서비스 이용약관과 버전 관리](/docs/knowledge/service-policy/terms-of-service-versioning) |
| 공통, 무료, 유료 조항 예시로 약관 초안을 씁니다. | [서비스 이용약관 예시 템플릿](/docs/knowledge/service-policy/terms-of-service-template) |
| 외부 코드를 사용하고 배포에 필요한 고지를 확인합니다. | [소프트웨어 라이선스와 오픈소스 고지](/docs/knowledge/security/software-supply-chain/license-and-oss-notice) |
| 릴리스에 포함된 구성요소와 버전을 추적합니다. | [SBOM과 배포 산출물 관리](/docs/knowledge/security/software-supply-chain/sbom-and-release-artifacts) |
