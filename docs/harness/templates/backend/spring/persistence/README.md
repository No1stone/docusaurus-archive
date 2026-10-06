# Persistence template

> **개요:** Entity / Repository / Specs 예제.

JPA entity, repository, and specs for ExampleItem.

## Files

- [`ExampleItem.java`](./ExampleItem.java)
- [`ExampleItemRepository.java`](./ExampleItemRepository.java)
- [`ExampleItemSpecs.java`](./ExampleItemSpecs.java)

## Source

### `ExampleItem.java`

```java
package com.example.template.exampleitem.persistence;

import com.example.template.support.EnStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ex_example_item")
public class ExampleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", length = 1024)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private EnStatus status;

    /** Soft deactivate — no physical delete. */
    public void delete() {
        this.status = EnStatus.DEACTIVATED;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public EnStatus getStatus() { return status; }
    public void setStatus(EnStatus status) { this.status = status; }
}
```

### `ExampleItemRepository.java`

```java
package com.example.template.exampleitem.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ExampleItemRepository
        extends JpaRepository<ExampleItem, Long>, JpaSpecificationExecutor<ExampleItem> {

    List<ExampleItem> findByIdIn(List<Long> ids);
}
```

### `ExampleItemSpecs.java`

```java
package com.example.template.exampleitem.persistence;

import com.example.template.exampleitem.dto.ExampleItemReq;
import com.example.template.support.EnStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ExampleItemSpecs {

    private ExampleItemSpecs() {}

    public static Specification<ExampleItem> forWebList(ExampleItemReq.WebListQuery query) {
        if (query == null) {
            return forWebList(null, null);
        }
        return forWebList(query.getKeyword(), query.getStatus());
    }

    /**
     * Web list — keyword on name (LIKE), status all|A|D.
     */
    public static Specification<ExampleItem> forWebList(String keyword, String status) {
        return (root, q, cb) -> {
            var predicates = cb.conjunction();

            if (StringUtils.hasText(status) && !"all".equalsIgnoreCase(status.trim())) {
                predicates = cb.and(predicates,
                        cb.equal(root.get("status"), EnStatus.of(status.trim())));
            }
            if (StringUtils.hasText(keyword)) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("name")), "%" + keyword.trim().toLowerCase() + "%"));
            }
            return predicates;
        };
    }
}
```
