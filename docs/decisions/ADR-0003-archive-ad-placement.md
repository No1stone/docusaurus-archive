---
id: adr-0003
title: 광고는 AdSense 자동 광고만 사용합니다
description: Origemite Archive의 애드센스 배치 결정. 수동 단위는 쓰지 않고 자동 광고만 유지합니다
status: accepted
unlisted: true
---
# 광고는 AdSense 자동 광고만 사용합니다

> **개요:** 수동으로 넣는 광고 단위는 쓰지 않습니다.
> Google AdSense 자동 광고(계정 스크립트)만 유지합니다.
> 글 Markdown에는 광고 마크업을 넣지 않습니다.

## 상태

채택됨 (2026-10-23에 수동 배치에서 자동 광고만 사용하도록 변경)

## 배경

애드센스 계정 스크립트는 모든 페이지 `<head>`에 한 번 둡니다.
이 사이트는 사람이 읽는 화면이자, 에이전트가 `docs/` 파일을 그대로 임포트하는 하네스 원본입니다.
광고 마크업이 글 파일에 들어가면 역할 계약과 ADR이 광고 태그와 함께 컨텍스트로 들어갑니다.

이전에는 홈·본문 중간·목차 아래·긴 글 끝에 수동 광고 단위(`AdSlot`)를 두었습니다.
레이아웃 여백과 슬롯 관리 부담이 커져, 자동 광고만 쓰도록 바꿨습니다.

## 결정

### 현재

- **AdSense 자동 광고만** 사용합니다.
- 계정 스크립트는 `docusaurus.config.ts`의 `scripts`에 **한 번만** 둡니다.
- `static/ads.txt`와 사이트 인증(애드센스·Search Console에 쓰는 검증)은 유지합니다.
- 본문, 홈, 사이드바, 목차, 푸터에 `<ins class="adsbygoogle">`나 슬롯 컴포넌트를 **직접 넣지 않습니다**.
- 글 파일(`.md`, `.mdx`) 안에 광고 마크업을 쓰지 않습니다.
- 페이지·테마 컴포넌트마다 계정 스크립트를 다시 로드하지 않습니다.

자동 광고의 실제 위치와 노출은 Google 쪽 설정과 정책에 따릅니다.
로컬·승인 전에는 광고가 비어 보일 수 있습니다.
빈 칸을 본문처럼 보이게 만들거나 클릭을 유도하는 문구를 붙이지 않습니다.

### 이전 결정 (폐기, 기록만 유지)

아래는 **더 이상 적용하지 않습니다**.
당시 수동 배치 규칙의 이력입니다.

- 홈: Explore Archive와 Recently Updated 사이 수동 1칸
- 문서: 첫 `h2` 절 뒤 광고 A, 데스크탑 목차 아래 광고 B, 긴 글·좁은 화면 끝 광고
- 구현: `AdSlot`, remark 삽입, DocItem TOC/Content 래퍼, `adSlot*` customFields
- 제외: `docs/harness/`, `unlisted: true`, `ads: false`, 본문 약 400단어 미만

해당 코드와 슬롯 설정은 저장소에서 제거했습니다.

## 개발할 때

사이트의 화면(`src/`), 설정(`docusaurus.config.ts`)을 고칠 때 이 결정을 적용합니다.

- 수동 광고 칸을 다시 추가하지 않습니다.
- 계정 스크립트 URL의 `client=` 값은 기존 pub ID를 유지합니다.
- `ads.txt`를 삭제하거나 내용을 비우지 않습니다.

## 관련

- ADR-0001 [원본은 Git 안의 Markdown으로 둡니다](./ADR-0001-markdown-git-as-engineering-source-of-truth.md)
- ADR-0002 [아카이브 화면은 Docusaurus로 둡니다](./ADR-0002-docusaurus-as-archive-reading-ui.md)

저장소 경로: `docusaurus.config.ts` (`scripts`), `static/ads.txt`.
