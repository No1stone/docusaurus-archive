package com.example.template.exampleitem.support.display;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.exampleitem.dto.ExampleItemRes;
import com.example.template.exampleitem.persistence.ExampleItemPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Facade 유스케이스: 저장된 PK(감사·FK)를 Port Name 조회로 표시명에 치환한다.
 * 호스트는 회원·농장 등 해당 도메인 Port를 주입한다.
 * 원셋은 ExampleItemPort.findAllName(Filter.ids)의 Name(url)로 예를 보여 준다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DisplayNameResolver {

    private final ExampleItemPort exampleItemPort;

    /**
     * ExampleItem id → 표시명(url). Port Name 조회({@code findAllName} + {@code Filter.ids})를 사용한다.
     * 감사 필드가 문자열 id이면 숫자 형태만 ExampleItem으로 해석한다.
     * 호스트의 회원 Port는 이 메서드 자리를 해당 Port Name 조회로 바꾼다.
     */
    public Map<String, String> findNameMap(List<String> ids) {
        List<Long> longIds = toLongIds(ids);
        if (longIds.isEmpty()) {
            return Collections.emptyMap();
        }
        ExampleItemReq.Filter filter = new ExampleItemReq.Filter();
        filter.setIds(longIds);
        return exampleItemPort.findAllName(filter).stream()
                .collect(Collectors.toMap(
                        name -> String.valueOf(name.getId()),
                        DisplayNameResolver::toDisplayName,
                        (left, right) -> left
                ));
    }

    public <T> void applyAuditorDisplayNames(
            Page<T> page,
            Function<T, String> createdByGetter,
            BiConsumer<T, String> createdBySetter,
            Function<T, String> updatedByGetter,
            BiConsumer<T, String> updatedBySetter
    ) {
        applyAuditorDisplayNames(
                page.getContent(),
                createdByGetter,
                createdBySetter,
                updatedByGetter,
                updatedBySetter
        );
    }

    public <T> void applyAuditorDisplayNames(
            List<T> items,
            Function<T, String> createdByGetter,
            BiConsumer<T, String> createdBySetter,
            Function<T, String> updatedByGetter,
            BiConsumer<T, String> updatedBySetter
    ) {
        if (items == null || items.isEmpty()) {
            return;
        }
        List<String> auditorIds = new ArrayList<>();
        for (T item : items) {
            collectId(auditorIds, createdByGetter.apply(item));
            collectId(auditorIds, updatedByGetter.apply(item));
        }
        applyAuditorDisplayNames(
                items,
                findNameMap(auditorIds),
                createdByGetter,
                createdBySetter,
                updatedByGetter,
                updatedBySetter
        );
    }

    public <T> void applyAuditorDisplayNames(
            List<T> items,
            Map<String, String> nameMap,
            Function<T, String> createdByGetter,
            BiConsumer<T, String> createdBySetter,
            Function<T, String> updatedByGetter,
            BiConsumer<T, String> updatedBySetter
    ) {
        if (items == null || items.isEmpty()) {
            return;
        }
        Map<String, String> safeMap = nameMap != null ? nameMap : Collections.emptyMap();
        applyResolvedName(items, createdByGetter, createdBySetter, safeMap);
        applyResolvedName(items, updatedByGetter, updatedBySetter, safeMap);
    }

    public <T> void applyCreatedByDisplayNames(
            List<T> items,
            Function<T, String> createdByGetter,
            BiConsumer<T, String> createdBySetter
    ) {
        if (items == null || items.isEmpty()) {
            return;
        }
        List<String> auditorIds = new ArrayList<>();
        for (T item : items) {
            collectId(auditorIds, createdByGetter.apply(item));
        }
        applyResolvedName(items, createdByGetter, createdBySetter, findNameMap(auditorIds));
    }

    private static String toDisplayName(ExampleItemRes.Name name) {
        if (StringUtils.hasText(name.getUrl())) {
            return name.getUrl().trim();
        }
        return String.valueOf(name.getId());
    }

    private static <T> void applyResolvedName(
            List<T> items,
            Function<T, String> getter,
            BiConsumer<T, String> setter,
            Map<String, String> nameMap
    ) {
        for (T item : items) {
            String id = getter.apply(item);
            if (StringUtils.hasText(id)) {
                setter.accept(item, nameMap.getOrDefault(id, id));
            }
        }
    }

    private static void collectId(List<String> ids, String id) {
        if (StringUtils.hasText(id)) {
            ids.add(id);
        }
    }

    private static List<Long> toLongIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return ids.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .filter(s -> s.chars().allMatch(Character::isDigit))
                .map(Long::valueOf)
                .distinct()
                .toList();
    }
}
