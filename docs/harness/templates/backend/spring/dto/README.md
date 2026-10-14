# DTO template

> **개요:** Req는 Ids, Filter, Create, Update. Res는 Id, Name, Single, Item 입니다.

`Filter`에는 `id` 다음 `ids`, 그리고 `startAt`, `endAt`이 있습니다.
`Item`은 `Single`을 상속합니다.
열거형 컬럼도 DTO에서는 문자열입니다.

## Files

- [`RestOutLogReq.java`](./RestOutLogReq.java)
- [`RestOutLogRes.java`](./RestOutLogRes.java)

## Source

### `RestOutLogReq.java`

```java
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
```

### `RestOutLogRes.java`

```java
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
```
