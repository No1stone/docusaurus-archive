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
