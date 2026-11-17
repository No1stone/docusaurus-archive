---
format: md
id: software-supply-chain-sbom-and-release-artifacts
title: "SBOM과 배포 산출물 관리"
sidebar_label: "SBOM과 배포 산출물 관리"
description: "릴리스별 SBOM으로 운영 이미지와 배포물에 포함된 구성요소와 버전을 추적하고, 취약점 공개 시 영향 범위를 찾는 방법을 정리합니다."
slug: /knowledge/security/software-supply-chain/sbom-and-release-artifacts
sidebar_position: 2
tags:
  - Security
  - SBOM
status: active
keywords:
  - "SBOM"
  - "CycloneDX"
  - "SPDX"
  - "소프트웨어 구성 명세서"
  - "배포 산출물"
  - "취약점 대응"
references:
  - "https://www.cisa.gov/sites/default/files/2024-07/SBOM%20FAQ%202024.pdf"
  - "https://www.cyber.gov.au/publication/2026-minimum-elements-software-bill-materials-sbom"
---

# SBOM과 배포 산출물 관리

평소에는 `build.gradle`이나 `package-lock.json`에서 프로젝트의 의존성을 확인합니다.
운영 중 어떤 라이브러리에 취약점이 공개되면 질문이 바뀝니다.
**지금 운영 중인 이미지나 고객사에 전달한 설치본에 그 버전이 들어 있습니까?**

SBOM은 소프트웨어 구성 명세서입니다.
구성요소의 이름과 버전, 구성요소 사이의 관계 등을 기록하며, SPDX나 CycloneDX 같은 형식으로 만들 수 있습니다.
수집 범위와 생성 시점에 따라 빌드 의존성, 최종 이미지의 OS 패키지 등 확인할 수 있는 내용이 달라집니다.
[CISA SBOM FAQ](https://www.cisa.gov/sites/default/files/2024-07/SBOM%20FAQ%202024.pdf), [2026 SBOM 최소 요소](https://www.cyber.gov.au/publication/2026-minimum-elements-software-bill-materials-sbom)

## Spring Boot 이미지와 React 번들은 별도로 추적할 수 있습니다

| 산출물 | 확인하려는 구성요소 | 함께 남길 식별자 예시 |
|---|---|---|
| Spring Boot 컨테이너 이미지 | 실행 JAR의 라이브러리와 이미지의 OS 패키지 | 이미지 다이제스트 |
| React 정적 배포물 | 빌드 기록을 통해 확인한 번들의 구성요소 | 릴리스 버전과 빌드 식별자 |

Gradle 의존성 목록을 기준으로 생성한 SBOM은 자바 의존성을 추적하는 데 쓸 수 있습니다.
컨테이너 안의 OS 패키지까지 확인하려면 최종 이미지도 분석해야 합니다.
릴리스 기록에는 어떤 단계에서 SBOM을 생성했고 어떤 산출물에 대응하는지 함께 남깁니다.

## 취약점이 공개됐을 때 써봅니다

1. 취약점 공지에서 패키지 이름과 영향받는 버전 범위를 확인합니다.
2. 릴리스별 SBOM에서 해당 구성요소가 포함된 산출물을 찾습니다.
3. 배포 기록에서 그 산출물이 현재 어느 환경에 실행 중인지 확인합니다.
4. 실제 영향 범위를 조사하고, 수정 버전으로 다시 배포한 뒤 새 산출물의 SBOM을 보존합니다.

SBOM에서 얻는 정보는 **어떤 구성요소가 어디에 들어갔는지**입니다.
취약점의 영향은 공지와 사용 조건을 대조해서 판단하고, 배포 시 제공할 오픈소스 고지는 각 라이선스의 조건에 따라 작성합니다.
