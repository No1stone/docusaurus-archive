---
id: postmortems
title: Postmortems
description: Failures, incidents, and design mistakes
unlisted: true
slug: /postmortems/
---

# Postmortems

:::info[노션에서 옮겨 온 글을 다듬고 있습니다]

이곳의 일부 글은 기존 노션 자료를 AI로 일괄 이전한 기록입니다.<br />
이전 과정에서 문장이나 구성이 어색해진 글은 제가 하나씩 읽으며 표현과 예제를 다듬고 있습니다.

:::

개발이 끝난 뒤에는 어떤 구성이 남았는지 볼 수 있지만, 작업 중에 왜 방향을 틀었는지는 잊기 쉽습니다.<br />
이곳에는 프로젝트를 진행하며 만난 문제와 당시 확인한 범위, 그 뒤에 바꾼 것을 남깁니다.

잘된 부분은 어떤 조건에서 효과가 있었는지 적습니다.<br />
시도에서 끝난 부분은 어디까지 됐고 무엇이 남았는지 구분합니다.<br />
다른 프로젝트에도 적용할 수 있는 판단은 [설계와 결정](/docs/decisions/)이나 [패턴](/docs/patterns/index)에서 이어집니다.

## 프로젝트 사례

| 사례 | 돌아보는 내용 |
|---|---|
| [레거시 개선 사례](/docs/postmortems/legacy-improvement-cases) | 기존 시스템에서 문제를 찾고 동작과 구조를 개선한 과정 |
| [MSA와 IAM 포트폴리오](/docs/postmortems/msa-iam-portfolio/overview) | 권한 라우팅, 서버 구성과 데이터 전달을 구현하거나 검토한 과정 |
