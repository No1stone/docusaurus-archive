package com.example.template.scenario.exampleitem;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * ExampleItem 시나리오 예시입니다.
 * 한 메서드 안에서 저장 → 조회 → 수정 → 최종 상태 → 없는 아이디 실패 순서를 봅니다.
 * 프로젝트에서는 이 자리를 실제 Facade/Service와 테스트 DB로 바꿉니다.
 * 다른 테스트 메서드를 호출해 시나리오를 짜지 않습니다.
 * ExampleItem 필드명(httpMethod, url)은 치환 토큰입니다.
 */
class ExampleItemScenarioTest {

    @Test
    @DisplayName("항목을 저장·수정한 뒤 조회하고, 없는 아이디는 실패한다")
    void saveUpdateFindAndMissingFails() {
        InMemoryExampleItems items = new InMemoryExampleItems();

        assertTrue(items.isEmpty());

        long id = items.save("GET", "/first");
        assertEquals("GET", items.find(id).httpMethod);
        assertEquals("/first", items.find(id).url);

        items.update(id, null, "/renamed");
        assertEquals("GET", items.find(id).httpMethod);
        assertEquals("/renamed", items.find(id).url);

        assertEquals(1, items.size());
        assertThrows(IllegalStateException.class, () -> items.find(999L));
    }

    /** 시나리오 자리만 보여 주는 인메모리 대체입니다. 프로젝트에 복사하지 않습니다. */
    private static final class InMemoryExampleItems {
        private final AtomicLong seq = new AtomicLong();
        private final Map<Long, Row> rows = new LinkedHashMap<>();

        boolean isEmpty() {
            return rows.isEmpty();
        }

        int size() {
            return rows.size();
        }

        long save(String httpMethod, String url) {
            long id = seq.incrementAndGet();
            rows.put(id, new Row(id, httpMethod, url));
            return id;
        }

        void update(long id, String httpMethod, String url) {
            Row current = find(id);
            rows.put(id, new Row(
                    id,
                    httpMethod == null || httpMethod.isBlank() ? current.httpMethod : httpMethod,
                    url == null || url.isBlank() ? current.url : url));
        }

        Row find(long id) {
            Row row = rows.get(id);
            if (row == null) {
                throw new IllegalStateException("NOT_FOUND_RESOURCE");
            }
            return row;
        }
    }

    private static final class Row {
        final long id;
        final String httpMethod;
        final String url;

        Row(long id, String httpMethod, String url) {
            this.id = id;
            this.httpMethod = Objects.requireNonNull(httpMethod);
            this.url = Objects.requireNonNull(url);
        }
    }
}
