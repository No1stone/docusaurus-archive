# ExampleItem Controller API E2E

> **개요:** ExampleItem 원셋의 내 서버 Controller CRUD 순차 검증 컬렉션입니다.
> Postman Collection v2.1과 로컬 환경 파일입니다.
> 이 아카이브에는 앱 서버가 없어 여기서는 JSON 형식만 확인합니다.
> 실행은 대상 프로젝트에서 합니다.
> 복사·치환·확장 지점의 본문은 [`../ONESET.md`](/docs/harness/templates/backend/spring/ONESET)입니다.

## 파일

| 파일 | 역할 |
|------|------|
| [`ExampleItem.api.collection.json`](./ExampleItem.api.collection.json) | 등록 → 조회 → 수정 → 변경 조회 → 삭제 → 입력 오류 → 없는 id |
| [`ExampleItem.api.environment.json`](./ExampleItem.api.environment.json) | `baseUrl`, `itemId`, `runId` |

## 시나리오

| 구분 | 요청 | 기대 (템플릿) | 프로젝트에서 채움 |
|------|------|---------------|-------------------|
| 정상 | 01 POST | 200, 성공 `code`, `itemId` 저장 | 경로·필드·`code` |
| 정상 | 02 GET | 등록 필드 유지 | 동일 |
| 정상 | 03 PUT | 200, 같은 id | 동일 |
| 경계 | 04 GET | 변경 필드만 바뀜 | 동일 |
| 정상 | 05 DELETE | 성공 `code` | 삭제 정책·삭제 후 부재 단언 여부 |
| 실패 | 06 POST | 성공 `code`가 아님 | 대표 입력 오류 본문 |
| 실패 | 07 GET 없는 id | 성공(200+성공 code)이 아님 | HTTP 상태·응답 형태 |

가짜 CRUD나 더미 직접 호출로 대체하지 않습니다.
실제 HTTP 엔드포인트와 테스트 DB만 사용합니다.
외부 연동 E2E는 원셋 밖입니다. [`ONESET.md`](/docs/harness/templates/backend/spring/ONESET)의 조건부 항목을 봅니다.

## 실행 예

```bash
newman run ExampleItem.api.collection.json -e ExampleItem.api.environment.json
```

프로젝트 전용 스크립트가 있으면 그 명령을 우선합니다.
E2E만 다룰 때는 [`api-collection-e2e`](/docs/harness/orchestrations/api-collection-e2e)입니다.
