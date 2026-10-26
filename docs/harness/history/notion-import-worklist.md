---
id: notion-import-worklist
title: Notion 자료 이전·보완 작업 목록
description: 분류 기준, 원본 목록 요약, 시범·사례 작성 추적
unlisted: true
---
# Notion 자료 이전·보완 작업 목록

> **개요:** `_imports/notion/` 자료를 아카이브에 정리하기 위한 작업 기준과 진행 기록입니다.
> 원본은 수정하지 않습니다.
> 전체 목록은 [notion-import-inventory.md](/docs/harness/history/notion-import-inventory)입니다.

## 목적

완성 글뿐 아니라 미완성 글과 링크 자료, 제목·링크만 있는 자료도 검토·보완하여 아카이브에 정리합니다.
이번 범위의 Knowledge·Architecture·Postmortems 작성·수정을 승인합니다.

## 분류 기준

Java·Spring·AWS·Kubernetes 같은 기술명으로 폴더를 나누지 않습니다.
하나의 글에서 여러 기술을 함께 다룰 수 있으므로, 문서의 목적과 성격으로 배치합니다.

| 영역 | 문서 성격 |
|---|---|
| Knowledge | 개념·사용법·구현 설명 |
| Architecture | 시스템 구성, 책임과 연결 구조 |
| Patterns | 재사용 가능한 해결 방식 |
| Decisions | 기술·구조를 선택한 이유와 대안 |
| Experiments | 검증 중이며 아직 채택하지 않은 접근 |
| Postmortems | 장애 원인과 개선 내용 |

기존 아카이브의 분류·목록화 기준을 필요한 범위에서 확인하고 따릅니다.
관련 기술은 frontmatter `tags`로 복수 표시합니다.
글은 한 곳에만 작성하고 목록에서 연결합니다.
노션의 폴더 구조를 그대로 이식하거나 기술별 분류 체계를 새로 만들지 않습니다.

회사·프로젝트 개선 사례는 묶음을 유지합니다.
장애·재발 방지가 중심이면 Postmortems, 설계·구조 개선이 중심이면 Architecture 등 기존 영역에 둡니다.

## 본문과 작업 기록의 구분

최종 문서 본문에는 이전 작업 설명(“원본은 링크 자료”, “AI가 보완”, “스크린샷을 복제하지 않음” 등)을 쓰지 않습니다.
본문은 주제·배경·문제·해결을 설명하고 출처·공식 문서만 연결합니다.
작성 범위·AI 보완·첨부 복구·공개 판단은 이 작업 목록과 [첨부 목록](/docs/harness/history/notion-import-attachments)에만 남깁니다.

## 공개 검토와 배포

`status: review`나 `unlisted`만으로 배포에서 빠지지 않습니다.
공개 여부가 미확정인 내용은 frontmatter `draft: true`로 두어 프로덕션 빌드(`npm run build`)에 포함하지 않습니다.
민감 정보가 없는 자료는 일괄 보류하지 않고 게시합니다.

## 원본별 처리

| 원본 상태 | 처리 |
|---|---|
| 완성 글 | 의미를 유지하고 오래되거나 부정확한 내용을 확인하여 보완 |
| 미완성 글 | 원래 의도를 유지하며 설명과 필요한 예제 보완 |
| 링크 자료 | 아래 링크 처리 규칙을 따름. **작성 후보에 포함** |
| 제목만 있는 메모 | 범위가 명확하면 작성 후보, 모호하면 보류 |
| 접근 불가 링크 | 내용을 추측하지 않고 보류 |

### 링크 자료 처리 규칙

- 링크 본문을 읽어 주제와 범위를 파악합니다.
- 현재 공식 문서로 정확성을 확인한 뒤 설명과 필요한 예제를 보완합니다.
- 제목이 “사용법”처럼 넓더라도 원문에서 다룬 범위를 넘어 종합 가이드로 확장하지 않습니다.
- 원문이 오래됐으면 변경된 부분을 구분해서 적습니다.
- 링크에 접근할 수 없으면 내용을 추측하지 말고 보류합니다.

### 이미지·스크린샷·다이어그램

- 원문 이미지·스크린샷·다이어그램도 이전 대상입니다.
- 본문에서 참조하는 첨부파일을 찾아 최종 글의 해당 위치에 두고 경로를 고칩니다.
- AWS 계정 ID, 리소스 ARN, 인스턴스 ID 같은 일반 식별자만으로는 이미지를 제외하지 않습니다.
- 비밀번호, Secret Access Key, API Secret, 액세스·세션 토큰, 개인키 등 인증 비밀이 보이면 해당 부분만 마스킹하고 설명 흐름은 유지합니다.
- 회사 비용·고객 정보 등 별도 공개 판단이 필요한 내용은 인증 비밀과 구분하여 [첨부 확인 목록](/docs/harness/history/notion-import-attachments)에 남깁니다.
- 미검토라는 이유만으로 민감 자료로 단정하지 않습니다.

원본(`_imports/notion/`)은 수정하지 않습니다.

## 원본 목록 요약

| 원본 상태(추정) | 건수 | 비고 |
|---|---|---|
| 미완성 | 157 | 작성 후보 |
| 완성 | 128 | 작성 후보 |
| 링크자료 | 45 | 작성 후보 (링크 규칙 적용) |
| 제목만 | 14 | 범위 명확 시 후보, 아니면 보류 |
| **합계** | **344** | |

상세 행은 [notion-import-inventory.md](/docs/harness/history/notion-import-inventory)입니다.

## 시범 작성 (3건)

| # | 원본 상태 | 원본 제목 | 배치 | 결과 경로 | 원작 의도 | AI 조사·보완 | 본문 정리 |
|---|---|---|---|---|---|---|---|
| 1 | 완성 | 팩토리 매서드(Factory Method) | Patterns | [factory-method.md](/docs/patterns/factory-method) | Creator 템플릿으로 아이템 생성 학습 코드 | 역할·적용 범위 설명, 문체 정리. 패키지 트리 이미지 배치. 깨진 이미지 링크 복구 | 작업 설명·원본 경로 나열 제거. 주제·예제·참고만 유지 |
| 2 | 미완성 | ACM + ALB | Knowledge | [https-on-alb-with-acm.md](/docs/knowledge/https-on-alb-with-acm) | ACM 검증 → ALB → Route 53 별칭 HTTPS | ACM DNS 검증을 공식 문서로 보완. 스크린샷 4장 배치 | “보완 범위” 표·작업 문구 제거. 흐름·캡션·공식 링크만 유지 |
| 3 | 링크자료 | Aws S3 API Reference document URL | Knowledge | [amazon-s3-api-reference.md](/docs/knowledge/amazon-s3-api-reference) | API Reference URL 보관 | Welcome 본문만 읽고 REST·버전·관련 API 요약. 종합 가이드로 확장하지 않음 | “링크 자료/AI 보완” 문구 제거. Welcome 범위 설명·공식 링크만 유지 |

첨부 상세는 [notion-import-attachments.md](/docs/harness/history/notion-import-attachments)입니다.

## 회사·프로젝트 개선 사례

| 원본 | 영역 | 구성 | 결과 경로 | 배포 |
|---|---|---|---|---|
| 민팃의 개선 사례 | Postmortems | 개선 묶음. 장애 초안은 게시 제외·보류 | `legacy-improvement-cases.md` | 개선 게시. 장애 2초안은 `draft` |
| 아이컴시스 개선사례 및 포트폴리오 | Postmortems | 개요 + 하위 6문서 | [overview](/docs/postmortems/msa-iam-portfolio/overview) | 게시. Enum·Query·비용 화면 포함(공개 허용) |

### 민팃 — 구성

| 문서 | 내용 | 배포 |
|---|---|---|
| [mintit-improvement-cases.md](/docs/postmortems/legacy-improvement-cases) | 환경, 차세대 배경, 레거시 개선 | 게시 |
| cloudwatch-log-integration-incident.md | CloudWatch 장애 초안 | `draft` (경험 불일치, 게시 제외·나중 재작성) |
| redis-startup-race-incident.md | Redis 기동 장애 초안 | `draft` (문장 부자연, 재작성 없음) |

작성자 재검토 대기 전체는 [notion-import-unclear-holds.md](/docs/harness/history/notion-import-unclear-holds)입니다.

### 공개 확인 반영 (작성자 확인)

| 항목 | 결과 | 반영 |
|---|---|---|
| 조직·벤더명 | 유지 | 민팃 환경 절 |
| 민팃 개선·성과 수치 | 공개 허용 | 레거시 개선 절 |
| 민팃 IAM·Redis 장애 | 분리 초안 작성 후 게시 제외·보류 | CloudWatch 제외, Redis `draft` 보류 |
| Enum·Query 회사 화면 | 공개 허용 | [권한·메뉴 개선](/docs/postmortems/msa-iam-portfolio/iam-and-menu-improvement) |
| AWS 비용 캡처 | 개인 자료·공개 허용 | [설계·비용](/docs/postmortems/msa-iam-portfolio/design-and-runtime#2024년-01월-aws비용) |
| R2dbcService password 리터럴 | 예제 값 확인 | 본문 유지 |

### 예제 비밀번호·인증정보 기준

- `#test` 등 따라 하기용 예제 비밀번호는 유지합니다.
- 실제 Secret Access Key, API Secret, 액세스·세션 토큰, 개인키는 게시하지 않습니다.
- AWS 계정 ID·일반 리소스 식별자는 노출만으로 제외하지 않습니다.

<a id="아이컴시스-57페이지-대응"></a>

### 아이컴시스 57페이지 대응

상태: **이전** / **제외**(빈 컨테이너·빈 페이지)

| 원본 제목 | 상태 | 최종 문서 | 절 |
|---|---|---|---|
| 설계 | 제외 | - | 컨테이너만 |
| Over view | 이전 | [overview.md](/docs/postmortems/msa-iam-portfolio/overview) | ## Over view |
| 서비스 개요 | 이전 | [overview.md](/docs/postmortems/msa-iam-portfolio/overview) | ## 서비스 개요 |
| IAM 구조를 표현한 이유 | 이전 | [iam-and-menu-improvement.md](/docs/postmortems/msa-iam-portfolio/iam-and-menu-improvement) | ## IAM 구조를 표현한 이유 |
| Enum으로 변환 | 이전 | [iam-and-menu-improvement.md](/docs/postmortems/msa-iam-portfolio/iam-and-menu-improvement) | ## Enum으로 변환 |
| Query의 코드화1 | 이전 | 동일 | ## Query의 코드화1 |
| Query의 코드화2 | 이전 | 동일 | ## Query의 코드화2 |
| Query의 코드화3 | 이전 | 동일 | ## Query의 코드화3 |
| 문제점 | 이전 | 동일 | ## 문제점 |
| AWS diagram | 이전 | [design-and-runtime.md](/docs/postmortems/msa-iam-portfolio/design-and-runtime) | ## AWS diagram |
| Server diagram | 이전 | 동일 | ## Server diagram |
| Domain Name | 이전 | 동일 | ## Domain Name |
| Logo | 이전 | 동일 | ## Logo |
| index.html | 이전 | 동일 | ## index.html |
| ERD | 이전 | 동일 | ## ERD |
| 비용 | 제외 | - | 컨테이너만 |
| 2024년 01월 aws비용 | 이전 | 동일 | ## 2024년 01월 aws비용 |
| AWS Setting | 제외 | - | 컨테이너만 |
| route53 DNS | 이전 | [aws-setting.md](/docs/postmortems/msa-iam-portfolio/aws-setting) | ## route53 DNS |
| ACM | 이전 | 동일 | ## ACM |
| cloudfront | 이전 | 동일 | ## cloudfront |
| s3 | 이전 | 동일 | ## s3 |
| route53+cloudfront | 이전 | 동일 | ## route53+cloudfront |
| VPC | 이전 | 동일 | ## VPC |
| Nat Instance AMI | 이전 | 동일 | ## Nat Instance AMI |
| EC2 Instance | 이전 | 동일 | ## EC2 Instance |
| Instance Schedlue | 이전 | 동일 | ## Instance Schedlue |
| LoadBalance | 이전 | 동일 | ## LoadBalance |
| Server Setting | 이전 | [runtime-data-path.md](/docs/postmortems/msa-iam-portfolio/runtime-data-path) | ## Server Setting |
| Nginx | 이전 | 동일 | ## Nginx |
| Mysql | 이전 | 동일 | ## Mysql |
| Gitea | 이전 | 동일 | ## Gitea |
| kafka | 이전 | 동일 | ## kafka |
| Confluentinc Connect Sink | 이전 | 동일 | ## Confluentinc Connect Sink |
| mysql 이중화 | 이전 | 동일 | ## mysql 이중화 |
| Debezium | 이전 | 동일 | ## Debezium |
| 통합 Docker-compose | 이전 | 동일 | ## 통합 Docker-compose |
| Service | 이전 | [application-services.md](/docs/postmortems/msa-iam-portfolio/application-services) | ## Service |
| AuthService | 이전 | 동일 | ## AuthService |
| 구조 (AuthService) | 이전 | 동일 | ## AuthService 구조 |
| signin | 이전 | 동일 | ## signin |
| Mock Test | 이전 | 동일 | ## Mock Test |
| ConfigServer | 이전 | 동일 | ## ConfigServer |
| EurekaServer | 이전 | 동일 | ## EurekaServer |
| Gateway | 이전 | 동일 | ## Gateway |
| 구조 (Gateway) | 이전 | 동일 | ## Gateway 구조 |
| Route | 이전 | 동일 | ## Route |
| Server Service | 이전 | 동일 | ## Server Service |
| CmmService | 이전 | 동일 | ## CmmService |
| 개발환경 | 제외 | - | 컨테이너만 |
| 노트북 | 이전 | [development-environment.md](/docs/postmortems/msa-iam-portfolio/development-environment) | ## 노트북 |
| IDE 및 TOOL | 이전 | 동일 | ## IDE 및 TOOL |
| PostMan | 이전 | 동일 | ## PostMan |
| 제목 없음 (4) | 제외 | - | 빈 페이지 |

## 원본 전체 최종 상태 (344, 중복 없음)

상세: [notion-import-final-status.md](/docs/harness/history/notion-import-final-status), [notion-import-final-status.json](./notion-import-final-status.json).
매핑 필드: `migrate_only` | `supplemented` | `author_review` | `n/a`.

| 최종 상태 | 건수 |
|---|---|
| 조사·보완 완료 | 163 |
| 원문 이전만 완료 | 109 |
| 기존 글에 통합 | 53 |
| 확인 보류 | 12 ([작성자 재검토 대기](/docs/harness/history/notion-import-unclear-holds)) |
| 제외 | 7 (빈 페이지 6 + centos 제목만 1) |

보류는 작성자 재검토 대기이며 `draft`로 프로덕션 빌드에서 제외합니다.

## 나머지 원본 일괄 이전과 조사·보완

시범 3건·아이컴시스·민팃을 제외한 원본을 목적·성격 기준으로 이전했습니다.
상세 대응은 [notion-import-mapping.json](./notion-import-mapping.json), 목록은 [notion-import-catalog.md](/docs/harness/history/notion-imported-catalog)입니다.

| 구분 | 건수 | 비고 |
|---|---|---|
| 조사·보완 완료 | 163 | `supplemented` (메신저·일부 WebFlux는 이후 보류로 이동) |
| 원문 이전만(완성 원본) | 109 | `migrate_only` |
| 작성자 재검토 대기 | 12 | [목록](/docs/harness/history/notion-import-unclear-holds) |
| 구축형 메신저 | 보류 | `self-hosted-messenger-candidates.md` (`draft`) |

### 예제·비밀 분류

| 분류 | 처리 |
|---|---|
| 일반 식별자·설정 키워드 19건 | 유지 |
| R2dbcService password 리터럴 | 예제 값으로 확인·유지 |
| 실제 Secret·토큰·개인키 | 해당 없음(현재 배치) |

### 첨부

- 누락됐던 `image.png` 일부는 원본에서 재탐색해 본문에 복원했습니다.
상세는 [notion-import-attachments.md](/docs/harness/history/notion-import-attachments)입니다.

## 이번 범위 / 제외

**포함:** 작성자 검토 반영(게시 제외·보류·java time·브라우저 흐름·GitHub Actions), 집계·링크·빌드 확인.

**제외:** 커밋·푸시(별도 요청 시). 보류 항목 임의 보완·공개.
