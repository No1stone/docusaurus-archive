# Support template

> **개요:** 공통 응답, 예외, 매핑, 페이지 쿼리 등 지원 타입 스텁.

Shared stubs used across the ExampleItem slice (response envelope, errors, paging, mapping).

## Files

- [`BizErrorException.java`](./BizErrorException.java)
- [`CommonResponse.java`](./CommonResponse.java)
- [`CommonResponseUtils.java`](./CommonResponseUtils.java)
- [`EnStatus.java`](./EnStatus.java)
- [`MapperSupport.java`](./MapperSupport.java)
- [`PageQuery.java`](./PageQuery.java)
- [`ResponseType.java`](./ResponseType.java)

## Source

### `BizErrorException.java`

```java
package com.example.template.support;

public class BizErrorException extends RuntimeException {
    private final ResponseType type;

    public BizErrorException(ResponseType type) {
        super(type.name());
        this.type = type;
    }

    public ResponseType getType() {
        return type;
    }
}
```

### `CommonResponse.java`

```java
package com.example.template.support;

public class CommonResponse<T> {
    private String code;
    private String message;
    private T data;

    public CommonResponse() {}

    public CommonResponse(String code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> CommonResponse<T> ok(T data) {
        return new CommonResponse<>("OK", "success", data);
    }

    public static CommonResponse<Void> ok() {
        return new CommonResponse<>("OK", "success", null);
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}
```

### `CommonResponseUtils.java`

```java
package com.example.template.support;

public final class CommonResponseUtils {
    private CommonResponseUtils() {}

    public static <T> CommonResponse<T> responseSuccess(T data) {
        return CommonResponse.ok(data);
    }

    public static CommonResponse<Void> responseSuccess() {
        return CommonResponse.ok();
    }
}
```

### `EnStatus.java`

```java
package com.example.template.support;

/** Soft status A/D — replace with project enum. */
public enum EnStatus {
    ACTIVE("A"),
    DEACTIVATED("D");

    private final String code;

    EnStatus(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static EnStatus of(String code) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("status code required");
        }
        String c = code.trim();
        for (EnStatus s : values()) {
            if (s.code.equalsIgnoreCase(c) || s.name().equalsIgnoreCase(c)) {
                return s;
            }
        }
        throw new IllegalArgumentException("unknown status: " + code);
    }
}
```

### `MapperSupport.java`

```java
package com.example.template.support;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.data.domain.Page;

import java.beans.PropertyDescriptor;
import java.util.List;

/** Stand-in for host ModelMapperUtil / BeanUtils. Prefer host utilities in real apps. */
public final class MapperSupport {
    private MapperSupport() {}

    public static <S, T> T map(S source, Class<T> targetType) {
        if (source == null) {
            return null;
        }
        try {
            T target = targetType.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(source, target);
            return target;
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
    }

    public static <S, T> List<T> mapAll(List<S> source, Class<T> targetType) {
        return source.stream().map(s -> map(s, targetType)).toList();
    }

    public static <S, T> Page<T> mapAll(Page<S> source, Class<T> targetType) {
        return source.map(s -> map(s, targetType));
    }

    /** Partial update: copy non-null properties only. */
    public static void copyNonNull(Object source, Object target) {
        BeanWrapper src = new BeanWrapperImpl(source);
        BeanWrapper trg = new BeanWrapperImpl(target);
        for (PropertyDescriptor pd : src.getPropertyDescriptors()) {
            String name = pd.getName();
            if ("class".equals(name) || !trg.isWritableProperty(name)) {
                continue;
            }
            Object value = src.getPropertyValue(name);
            if (value != null) {
                trg.setPropertyValue(name, value);
            }
        }
    }
}
```

### `PageQuery.java`

```java
package com.example.template.support;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/** List query base — replace with host PageQuery if present. */
public class PageQuery {

    public static final int DEFAULT_SIZE = 20;
    public static final int MAX_SIZE = 100;

    private int page = 0;
    private int size = DEFAULT_SIZE;

    public int getPage() {
        return Math.max(page, 0);
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
    }

    public void setSize(int size) {
        this.size = size;
    }

    public Pageable toPageable() {
        return PageRequest.of(getPage(), getSize(), Sort.by(Sort.Direction.DESC, "id"));
    }
}
```

### `ResponseType.java`

```java
package com.example.template.support;

public enum ResponseType {
    NOT_FOUND_RESOURCE,
    UNDEFINED
}
```
