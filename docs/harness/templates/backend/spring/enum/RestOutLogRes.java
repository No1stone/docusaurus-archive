package com.example.template.restoutlog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

public class RestOutLogRes {

    @Schema(description = "RestOutLogRes.Id DTO")
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Id {
        @Schema(description = "아이디")
        private Long id;
    }

    @Schema(description = "RestOutLogRes.Name DTO")
    @Data
    @EqualsAndHashCode(callSuper = true)
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Name extends Id {
        // 변수 없음
    }

    @Schema(description = "RestOutLogRes.Single DTO")
    @Data
    @EqualsAndHashCode(callSuper = true)
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Single extends Name {
        @Schema(description = "등록 일시")
        private LocalDateTime createdAt;
        @Schema(description = "등록자 아이디(system)")
        private String createdBy;
        @Schema(description = "HTTP METHOD")
        private String httpMethod;
        @Schema(description = "요청 URI")
        private String url;
        @Schema(description = "파라미터")
        private String parameter;
        @Schema(description = "본문")
        private String payload;
        @Schema(description = "HTTP상태 코드")
        private String responseHttpStatus;
        @Schema(description = "응답 전문")
        private String response;
    }

    @Schema(description = "RestOutLogRes.Item DTO")
    @Data
    @EqualsAndHashCode(callSuper = true)
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Item extends Single {
        // 변수 없음
    }
}
