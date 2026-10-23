---
format: md
id: k-github-actions-archive-deploy
title: GitHub Actions
description: 이 Docusaurus 아카이브 저장소의 Deploy Archive 워크플로 개념과 설정
tags:
  - GitHub
  - CI
  - AWS
status: active
slug: /knowledge/k-github-actions-archive-deploy
---
# GitHub Actions

## 개요

이 Docusaurus 아카이브 저장소의 Deploy Archive 워크플로 개념과 설정입니다.

> 추측한 배포 방식이나 예제 비밀값을 실제 설정처럼 적지 않습니다.
경로: `.github/workflows/deploy-archive.yml` (저장소 루트 기준)
워크플로 이름: `Deploy Archive`
`main` 브랜치에 **push**될 때 실행됩니다.
워크플로에 선언된 권한입니다.
`Build` 스텝의 `env`에 다음 키가 있습니다.
값은 워크플로에 숫자 문자열로 들어 있으며, 수동 광고 슬롯용으로 쓰이던 설정입니다.
- `AD_SLOT_IN_ARTICLE`
- `AD_SLOT_RAIL`
사이트 코드에서는 수동 광고 슬롯을 제거한 상태이므로, 이 변수가 빌드 결과에 광고 단위를 넣지는 않습니다.
워크플로 파일에 아직 남아 있다는 사실만 기록합니다.
역할 ARN은 저장소 **Variables**의 `AWS_ROLE_ARN`을 참조합니다.

| 권한 | 값 | 용도(파일 기준) |
|---|---|---|
| `id-token` | `write` | AWS에 OIDC로 역할을 맡기 위해 사용 |
| `contents` | `read` | 저장소 체크아웃 |

| 단계 이름 | 하는 일 | 워크플로에 적힌 내용 |
|---|---|---|
| Checkout | 코드 가져오기 | `actions/checkout@v4` |
| Setup Node | Node 준비 | `actions/setup-node@v4`, `node-version: 22`, `cache: npm` |
| Install dependencies | 의존성 설치 | `npm ci` |
| Build | 사이트 빌드 | `npm run build` |
| Configure AWS credentials | AWS 자격 증명 | `aws-actions/configure-aws-credentials@v4` |
| Deploy to S3 | 빌드 결과 업로드 | `aws s3 sync build/ s3://origemite-html/docusaurus-archive/ --delete` |
| Invalidate CloudFront | CDN 무효화 | `aws cloudfront create-invalidation` |

## 예제·코드

```yaml
role-to-assume: ${{ vars.AWS_ROLE_ARN }}
aws-region: ap-northeast-2
```

```bash
npm ci
npm run build
```

<details>
<summary>참고 자료</summary>

- [GitHub Actions 문서](https://docs.github.com/en/actions) — Automate, customize, and execute your software development workflows right in your repository with GitHub Actions. You can discover, create, and share actions to perform any job yo
- [configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials) — Configure AWS credential environment variables for use in other GitHub Actions. - aws-actions/configure-aws-credentials
</details>
