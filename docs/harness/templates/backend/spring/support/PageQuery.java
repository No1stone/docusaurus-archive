package com.example.template.support;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * 목록 조회 API 공통 페이징 파라미터.
 * 기본 size 20, 상한 100. 서버에서 clamp 합니다.
 */
@Schema(description = "목록 조회 페이징")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageQuery {

    public static final int MAX_SIZE = 100;
    public static final int DEFAULT_SIZE = 20;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "id");

    /**
     * Web 목록 기본 정렬: 숫자 PK → {@code id DESC}.
     * 그 외 PK는 Facade에서 {@code createdAt DESC} 등으로 {@link #toPageable(Sort)} 전달.
     */

    @Min(0)
    @Schema(description = "페이지 번호(0부터)", defaultValue = "0")
    Integer page = 0;

    @Min(1)
    @Max(MAX_SIZE)
    @Schema(description = "페이지 크기(1~100)", defaultValue = "20")
    Integer size = DEFAULT_SIZE;

    public int resolvedPage() {
        return page != null && page >= 0 ? page : 0;
    }

    public int resolvedSize() {
        int rawSize = size != null ? size : DEFAULT_SIZE;
        return Math.min(Math.max(rawSize, 1), MAX_SIZE);
    }

    public Pageable toPageable() {
        return toPageable(DEFAULT_SORT);
    }

    public Pageable toPageable(Sort sort) {
        return PageRequest.of(resolvedPage(), resolvedSize(), sort);
    }
}
