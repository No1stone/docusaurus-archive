# Testing template

> **개요:** Spring 테스트의 최소 골격입니다.
> 배치와 경계의 기준은 [테스트 기본 구조](/docs/knowledge/backend/testing/test-structure)입니다.
> 아래 예시는 이 아카이브에서 실행하지 않았습니다.

프로젝트에 이미 있는 테스트 구조와 assertion 방식을 우선합니다.
없는 도구를 기본 의존성으로 추가하지 않습니다.

## 적용

| 파일 | 프로젝트에서의 자리 |
|---|---|
| [`ExampleItemFacadeTest.java`](./ExampleItemFacadeTest.java) | `src/test/java` 아래, 파사드와 같은 패키지 |
| [`ExampleItemScenarioTest.java`](./ExampleItemScenarioTest.java) | `src/test/java` 아래 `scenario` 의 업무 폴더 |

`ExampleItem`은 치환 토큰입니다.
대상 도메인명으로 바꿉니다.

파사드 테스트는 Service를 대체하고, 파사드가 돌려준 값을 확인합니다.
호출 횟수만 확인하고 끝내지 않습니다.

시나리오 예시는 한 메서드 안의 순서와 최종 상태만 보여 줍니다.
Spring과 테스트 DB를 띄우지 않습니다.
프로젝트의 시나리오는 실제 내부 계층과 테스트 DB를 사용하고, 외부 시스템은 로컬 스텁으로 대체합니다.

## Source

### `ExampleItemFacadeTest.java`

```java
package com.example.template.exampleitem.facade;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.service.ExampleItemService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

/**
 * 테이블 파사드의 단위 골격입니다.
 * Service를 대체하고, 파사드가 돌려주는 결과를 확인합니다.
 * 이 아카이브에서 실행하지 않았습니다.
 */
@ExtendWith(MockitoExtension.class)
class ExampleItemFacadeTest {

    @Mock
    private ExampleItemService exampleItemService;

    @InjectMocks
    private ExampleItemFacade exampleItemFacade;

    @Test
    @DisplayName("저장 결과는 서비스가 돌려준 아이디다")
    void saveReturnsIdFromService() {
        ExampleItemReq.Create create = new ExampleItemReq.Create();
        ExampleItemRes.Id expected = new ExampleItemRes.Id();
        expected.setId(10L);
        when(exampleItemService.save(create)).thenReturn(expected);

        ExampleItemRes.Id actual = exampleItemFacade.save(create);

        assertEquals(10L, actual.getId());
    }
}
```

### `ExampleItemScenarioTest.java`

```java
package com.example.template.scenario.exampleitem;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * 시나리오 순서의 골격입니다.
 * 한 메서드 안에서 초기 상태, 행동, 중간 확인, 다음 행동, 최종 상태를 봅니다.
 * 다른 테스트 메서드를 호출하지 않습니다.
 * 프로젝트의 시나리오는 테스트 DB와 내부 계층을 사용합니다.
 * 이 파일은 그 자리를 보여 주는 예시이며, 이 아카이브에서 실행하지 않았습니다.
 */
class ExampleItemScenarioTest {

    @Test
    @DisplayName("항목을 저장한 뒤 이름을 바꾸면 최종 상태에 반영된다")
    void saveThenRenameKeepsOneItem() {
        Map<Long, String> storedNames = new HashMap<>();

        assertTrue(storedNames.isEmpty());

        storedNames.put(1L, "first");
        assertEquals("first", storedNames.get(1L));

        storedNames.put(1L, "renamed");

        assertEquals(1, storedNames.size());
        assertEquals("renamed", storedNames.get(1L));
    }
}
```
