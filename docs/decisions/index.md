---
id: decisions
title: Decisions
description: Architecture Decision Records
---

# Decisions (ADR)

:::note[왜 이렇게 만들었는지 남깁니다]

각 ADR에는 당시 상황, 검토한 선택지, 결정과 그에 따른 변화를 담습니다.

:::

원본 문서를 왜 Git에 두는지, 외부 API 호출이 많은 서버에서 왜 MVC를 선택했는지는 코드만 봐서는 알기 어렵습니다.<br />
당시 판단을 남겨 두면 조건이 달라졌을 때도 같은 선택을 유지할지 다시 검토할 수 있습니다.

## 결정 목록

| 번호 | 결정 | 상태 |
|------|------|------|
| ADR-0001 | [원본은 Git 안의 Markdown으로 둡니다](/docs/decisions/adr-0001) — 설계 결정과 개발 기준을 Markdown과 Git에 남겨 사람과 AI가 같은 근거를 재사용합니다 | 채택 |
| ADR-0002 | [아카이브 화면은 Docusaurus로 둡니다](/docs/decisions/adr-0002) — Markdown 원본은 유지하고, 문서 탐색과 React 기반 화면 구성을 Docusaurus에 맡깁니다 | 채택 |
| ADR-0004 | [블로킹 기반 업무 처리에 Spring MVC와 Virtual Threads를 선택한 이유](/docs/decisions/adr-0004) — JPA와 RestClient가 중심이면 유스케이스를 명령형 호출로 유지하고, Virtual Threads로 대기를 받습니다 | 채택 |
| ADR-0005 | [코드 컨벤션은 왜 생겼고, 왜 중요한가](/docs/decisions/adr-0005) — 여러 사람이 같은 코드를 오래 읽고 수정하기 위한 약속이며, AI 적용과 팀 규칙 변경은 별개다 | 채택 |
| ADR-0006 | [코드 컨벤션을 템플릿과 하네스로 연결한다](/docs/decisions/adr-0006) — 컨벤션을 템플릿으로 구조화하고 하네스가 선택·적용하며, 원셋 복사와 토큰 최소 경로로 일관된 변경을 만든다 | 채택 |
| ADR-0007 | [구글의 Harness²·RRSI와 내가 만드는 하네스의 방향](/docs/decisions/adr-0007) — 연구와 맞닿은 고민을 참고하되, 공통 기준 변경은 사람이 승인하는 현재 방식을 유지한다 | 채택 |
| ADR-0008 | [AI Harness — 참고 자료와 적용 원칙](/docs/decisions/adr-0008) — 외부 참고와 프로젝트 운영 방식을 구분하고, 행동 단위로 하네스를 평가·개선한다 | 채택 |
| ADR-0009 | [PHP 보안 취약점 대응을 위한 런타임 및 애플리케이션 업그레이드](/docs/decisions/adr-0009) — PHP 단독 교체 대신 Nextcloud 공식 이미지 기반 메이저 순차 업그레이드를 선택합니다 | 채택 |
| ADR-0010 | [애플리케이션, Port, Adapter로 계층 이름을 정리한다](./플랫폼과%20하네스/ADR-0010-application-port-adapter-naming.md) — 계층은 접미사가 아니라 책임으로 구분하고, 기존 JPA Service는 Port와 Adapter로 표현합니다 | 채택 |
| ADR-0011 | [FE는 취약점이 해결된 React와 Node 패치 라인을 쓴다](./런타임과%20보안/ADR-0011-fe-react-node-patched-runtime.md) — RSC 등 공개 취약점 대응으로 패치된 런타임·의존성을 기본으로 둡니다 | 채택 |
| ADR-0012 | [알림은 outbox 없이 두고, 재처리가 필요한 전달만 outbox를 쓴다](./플랫폼과%20하네스/ADR-0012-alerts-without-outbox.md) — 메일·문자·카톡은 best-effort, 웹훅·확정·Saga 발행은 outbox | 채택 |
| ADR-0013 | [Flyway를 하네스 기본 마이그레이션으로 두지 않는다](./플랫폼과%20하네스/ADR-0013-no-flyway-as-default.md) — 동일 스키마 다중 Flyway·가시성 문제로 기본 강제하지 않음 | 채택 |
| ADR-0014 | [서비스 간 트레이스 전파는 W3C Trace Context를 디폴트로 둔다](./플랫폼과%20하네스/ADR-0014-trace-propagation-w3c-default.md) — Actuator·Micrometer Tracing, B3는 레거시만 | 채택 |

번호는 파일명과 `id`에만 둡니다.
다른 문서에서 가리킬 때는 "ADR-0002"처럼 번호로 부르고, 제목 자체에는 번호를 붙이지 않습니다.
