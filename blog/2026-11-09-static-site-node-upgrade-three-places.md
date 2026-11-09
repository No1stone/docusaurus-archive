---
slug: static-site-node-upgrade-three-places
title: "정적 사이트인데도 Node.js를 올렸습니다. 바꾼 곳은 세 군데였습니다"
description: "정적 Docusaurus라도 Node2Shell 공지 후 로컬·CI Node를 22.23.4로 맞춘 이유. mise, Actions, engines 세 곳만 바꾼 과정을 정리합니다."
authors: []
tags:
  - nodejs
  - security
  - harness-engineering
  - docusaurus
  - operations
date: 2026-11-09
---

# 정적 사이트인데도 Node.js를 올렸습니다. 바꾼 곳은 세 군데였습니다

PHP 보안 이슈를 살펴본 뒤, 제 Docusaurus 사이트의 Node.js 버전도 확인했습니다.  
원격 코드 실행으로 이어질 수 있다는 공지를 보고, 의존성이나 빌드 설정도 함께 손봐야 할 줄 알았습니다.

막상 변경 내역을 보니 `mise.toml`, GitHub Actions 배포 워크플로, `package.json` 세 곳이 전부였습니다.  
제 사이트에서 **Node.js가 언제 실행되는지**를 확인하고 나니, 바꿔야 할 범위도 그만큼 분명해졌습니다.

{/* truncate */}

## 취약점이 있는 버전과 외부에 노출된 경로를 따로 봤습니다

2026년 10월 21일 Node.js 보안 공지에는 내장 Brotli 디코더의 취약점인 `CVE-2026-111497`이 포함됐습니다.  
애플리케이션이 공격자가 제공한 Brotli 데이터를 `node:zlib`으로 압축 해제할 때 메모리 손상이 발생할 수 있고, 원격 코드 실행으로도 이어질 수 있습니다.  
제가 로컬에서 쓰던 `22.23.3`은 수정 전 버전이었고, Node.js 22 계열에서는 `22.23.4`에 수정이 포함됐습니다. [Node.js 2026년 10월 보안 공지](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)

다음으로 확인한 건 방문자의 요청이 그 Node.js 프로세스에 도달하는지였습니다.

```text
로컬 mise 또는 GitHub Actions
  → Node.js로 Docusaurus 빌드
  → HTML, CSS, JavaScript를 S3에 업로드

방문자
  → CloudFront에서 빌드된 정적 파일을 받음
```

제 사이트에서 Node.js는 **페이지를 만드는 시점**에 실행됩니다.  
배포한 뒤 방문자가 페이지를 요청하면 CloudFront가 완성된 파일을 전달합니다.  
공개 요청 경로에는 제가 운영하는 Node.js 서버가 없으므로, 이번 취약점의 압축 해제 코드까지 방문자 입력이 들어가는 구조는 아니었습니다.

그래도 로컬 개발 서버와 CI에서 실제로 쓰는 런타임은 패치해 두기로 했습니다.  
이왕 올리는 김에 로컬에서 확인한 버전과 배포에 쓰는 버전도 맞췄습니다.

## 평소 쓰는 mise와 배포 환경을 맞췄습니다

| 위치 | 변경 | 역할 |
|---|---|---|
| `mise.toml` | `22` → `22.23.4` | 로컬 프로젝트에서 사용할 Node.js 버전 고정 |
| GitHub Actions 배포 워크플로 | `node-version: "22.23.4"` | CI에서 설치하고 빌드할 버전 고정 |
| `package.json`의 `engines.node` | `>=22.23.4` | 프로젝트가 요구하는 최소 버전 명시 |

로컬에서는 설정 파일에 적힌 값과 실제로 선택된 버전이 같은지 확인했습니다.

```bash
mise exec -- node -v
# v22.23.4
```

이미 켜 둔 `npm start`는 시작할 때의 Node.js 프로세스로 계속 동작합니다.  
그 개발 서버에도 새 버전을 적용하려면 다시 시작해야 합니다.

## 그래서 설정 변경으로 끝났습니다

수정은 Node.js에 포함된 Brotli 디코더에 들어갔습니다.  
제 프로젝트에서 할 일은 패치된 런타임으로 빌드 환경을 바꾸는 것이었고, Docusaurus 페이지 코드나 번들러를 수정할 필요는 없었습니다.

보안 공지를 읽을 때 **어떤 버전이 영향을 받는지**와 **외부 입력이 그 코드에 도달하는지**를 따로 확인하니 대응 범위가 명확해졌습니다.  
이번에는 공개 사이트의 요청 처리 구조를 바꿀 일이 없었고, 제가 직접 관리하는 로컬과 CI의 Node.js를 같은 패치 버전으로 맞추는 것으로 마무리했습니다.
