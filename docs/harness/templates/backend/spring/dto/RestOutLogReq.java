package com.example.template.restoutlog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import lombok.experimental.FieldNameConstants;

import java.time.LocalDateTime;
import java.util.List;

public class RestOutLogReq {

    @Schema(description = "RestOutLogReq.Ids DTO")
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Ids {
        @Schema(description = "아이디")
        private List<Long> ids;
    }

    @Schema(description = "RestOutLogReq.Filter DTO")
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @FieldNameConstants
    public static class Filter {
        @Schema(description = "아이디")
        private Long id;
        @Schema(description = "아이디 목록")
        private List<Long> ids;
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
        @Schema(description = "조회 시작 일시")
        private LocalDateTime startAt;
        @Schema(description = "조회 종료 일시")
        private LocalDateTime endAt;
    }

    @Schema(description = "RestOutLogReq.Create DTO")
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Create {
        @Schema(description = "아이디")
        private Long id;
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

    @Schema(description = "RestOutLogReq.Update DTO")
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Update {
        @Schema(description = "아이디")
        private Long id;
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

}
