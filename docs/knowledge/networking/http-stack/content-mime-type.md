---
format: md
id: k-content-mime-type
title: "CONTENT (MIME) TYPE"
description: "확장자별 흔한 MIME 타입을 찾는 MDN Common types 표 요약"
tags:
  - HTTP
status: active
slug: /knowledge/k-content-mime-type
---
# CONTENT (MIME) TYPE

## 개요

확장자별 흔한 MIME 타입을 찾는 MDN Common types 표 요약입니다.

MDN은 다음 두 가지를 기본 타입으로 강조합니다.
- `text/plain`: 텍스트 파일의 기본값. 사람이 읽을 수 있고 바이너리가 아니어야 합니다.
- `application/octet-stream`: 그 외 알 수 없는 파일의 기본값. 브라우저는 보통 다운로드로 처리합니다.
공식 등록 목록은 IANA MIME media types입니다.
웹에서 자주 쓰는 것만 MDN 표에 정리되어 있습니다.
서버가 `Content-Type`을 잘못 주면 브라우저가 스크립트를 실행하거나 렌더링을 잘못할 수 있습니다.
다운로드만 시키고 싶을 때는 `application/octet-stream`과 함께 `X-Content-Type-Options: nosniff`를 고려합니다.
전체 표는 MDN 원문을 봅니다.

| 확장자 | MIME Type |
|--------|-----------|
| `.html`, `.htm` | `text/html` |
| `.css` | `text/css` |
| `.js`, `.mjs` | `text/javascript` |
| `.json` | `application/json` |
| `.png` | `image/png` |
| `.jpg`, `.jpeg` | `image/jpeg` |
| `.svg` | `image/svg+xml` |
| `.pdf` | `application/pdf` |
| `.zip` | `application/zip` |
| `.xml` | `application/xml` (권장), 경우에 따라 `text/xml` |

<details>
<summary>참고 자료</summary>

- [MDN — Common media types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) — This topic lists the most common MIME types with corresponding document types, ordered by their common extensions.
</details>
