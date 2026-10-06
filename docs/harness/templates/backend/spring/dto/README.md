# Dto template

> **개요:** 요청/응답 DTO 예제.

Request / response DTOs for the ExampleItem slice.

## Files

- [`ExampleItemReq.java`](./ExampleItemReq.java)
- [`ExampleItemRes.java`](./ExampleItemRes.java)

## Source

### `ExampleItemReq.java`

```java
package com.example.template.exampleitem.dto;

import com.example.template.support.PageQuery;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

/**
 * Request DTOs — inner class pattern.
 * Web* types are BFF-facing; Create/Update are domain service inputs.
 */
public class ExampleItemReq {

    public static class Ids {
        private List<Long> ids;

        public List<Long> getIds() { return ids; }
        public void setIds(List<Long> ids) { this.ids = ids; }
    }

    public static class Filter {
        private Long id;
        private String name;
        private String status;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class Create {
        private String name;
        private String description;
        private String status;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class Update {
        private String name;
        private String description;
        private String status;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    /** Web BFF list query. */
    public static class WebListQuery extends PageQuery {
        private String keyword;
        /** all | A | D */
        private String status;

        public String getKeyword() { return keyword; }
        public void setKeyword(String keyword) { this.keyword = keyword; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class WebCreate {
        @NotBlank
        private String name;
        private String description;
        @NotBlank
        private String status;

        public Create toCreate() {
            Create c = new Create();
            c.setName(name != null ? name.trim() : null);
            c.setDescription(description);
            c.setStatus(status);
            return c;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class WebUpdate {
        @NotBlank
        private String name;
        private String description;
        @NotBlank
        private String status;

        public Update toUpdate() {
            Update u = new Update();
            u.setName(name != null ? name.trim() : null);
            u.setDescription(description);
            u.setStatus(status);
            return u;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
```

### `ExampleItemRes.java`

```java
package com.example.template.exampleitem.dto;

import java.time.LocalDateTime;

/** Response DTOs — Id / Item / Name + Web* results. */
public class ExampleItemRes {

    public static class Id {
        private Long id;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
    }

    public static class Item {
        private Long id;
        private String name;
        private String description;
        private String status;
        private String createdBy;
        private String updatedBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getCreatedBy() { return createdBy; }
        public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
        public String getUpdatedBy() { return updatedBy; }
        public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }

    public static class Name {
        private Long id;
        private String name;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class WebCreated extends Id {}

    public static class WebUpdated extends Id {}
}
```
