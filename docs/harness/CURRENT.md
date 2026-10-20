# 현재 상태

> **개요:** 이 아카이브 하네스의 현재 상태입니다.
> 과거 작업 로그를 여기에 덧붙이지 않습니다.

- 공통 원셋 목표: 검증된 구현·단위/시나리오 테스트·Controller API E2E를 템플릿화하고, 새 작업에서는 복사 후 달라지는 부분만 채웁니다. 안내는 [`templates/backend/spring/ONESET.md`](./templates/backend/spring/ONESET.md)입니다. 외부 스펙 더미 연동 E2E는 원셋 밖 추가 조건입니다.
- 기본 흐름은 [`workflows/implement.md`](./workflows/implement.md)입니다.
- 통과 기준 형식은 [`workflows/acceptance.md`](./workflows/acceptance.md)입니다.
- 구현 우선순위는 프로젝트 규칙, 적용 가능한 템플릿, 저장소의 기존 패턴, 승인된 범위의 최소 구현입니다.
- Curator와 Knowledge, 템플릿 수정은 사용자가 요청할 때만 합니다.
- `docs/history`는 엔지니어링 방식의 변천입니다. 작업 로그가 아니며 기본으로 읽지 않습니다.
- 작업 로그는 [`history/`](./history/)입니다. 필요할 때 해당 월만 검색합니다.
- 개인 세션 메모는 이 저장소 밖입니다. 여기 기록과 복제하지 않습니다.
- Backend Knowledge(Controller, Facade, Service, 테스트 구조)는 채택된 구현 기준입니다.
- 문서를 작성하거나 수정할 때의 기준은 [`context/writing-conventions.md`](./context/writing-conventions.md)입니다. 코드 작업에서는 읽지 않습니다.
- 상황 레시피는 [`orchestrations/index.md`](./orchestrations/index.md)에서 고릅니다. 레시피를 골라도 기본은 단일 에이전트입니다.
