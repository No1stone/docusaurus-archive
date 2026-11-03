# ExampleItem DTO

`Id` → `Name` → `Single` → `Item` 사다리입니다.

| 타입 | 역할 |
|------|------|
| `Id` | 생성·수정 응답, 식별만 |
| `Name` | 콤보·표시명 맵 (`findAllName`) |
| `Single` | 본 행 스칼라 |
| `Item` | 목록·상세. 원셋은 연관 필드 없음 |

원셋 `Item`을 키우지 않습니다.
`createdByName`·`org: OrgRes.Name` 등 **Item 확장·Facade 조립**은
[유스케이스와 DTO](/docs/harness/templates/backend/spring/db-design/usecase-dto)를 봅니다.
