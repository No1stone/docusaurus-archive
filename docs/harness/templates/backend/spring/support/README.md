# Support template

> **개요:** 테이블 세트와 이넘 세트가 호출하는 지원 타입 전체입니다.

호스트에 같은 역할의 클래스가 있으면 호스트 클래스를 씁니다.
`BaseEntity`는 `AuditingEntityListener`와 `BaseEntityListener`를 함께 등록합니다.
등록, 수정 감사 컬럼은 `CreatedEntity` / `UpdatedEntity`입니다.
프로젝트 테이블 설계에서 언제 Created만 쓰는지 등은 [DB 설계 하네스, Audit](/docs/harness/templates/backend/spring/db-design/audit)을 봅니다.
`IdGeneratable`, `ServiceProviderble`을 구현한 엔티티만 `BaseEntityListener`가 id, 서비스 id를 채웁니다.
서비스 id는 호스트 `WebUtils.getServiceId()` 등으로 채웁니다.
표시명 치환(`DisplayNameResolver`)은 [exampleitem/support/display](../exampleitem/support/display/DisplayNameResolver.java)에 둡니다.
`CodeValueConverter.convertToEntityAttribute`의 예외는 호스트의 열거형 오류 예외로 바꿉니다.

업무 실패는 `BizErrorException` / `BizWarnException`만 던집니다.
생성자는 `ResponseTypeInterface`만 받습니다.
`ResponseType`에는 시스템 공통 코드만 두고, API 모듈 전용 코드는 모듈 이넘이 인터페이스를 구현해 넘깁니다.
전역 변환은 [`CommonExceptionAdvice.java`](./CommonExceptionAdvice.java)가 담당합니다.

## Files

- [`ResponseTypeInterface.java`](./ResponseTypeInterface.java)
- [`ResponseType.java`](./ResponseType.java)
- [`SystemServiceModule.java`](./SystemServiceModule.java)
- [`BizException.java`](./BizException.java)
- [`BizErrorException.java`](./BizErrorException.java)
- [`BizWarnException.java`](./BizWarnException.java)
- [`CommonResponse.java`](./CommonResponse.java)
- [`CommonResponseUtils.java`](./CommonResponseUtils.java)
- [`CommonExceptionAdvice.java`](./CommonExceptionAdvice.java)
- [`CreatedEntity.java`](./CreatedEntity.java)
- [`UpdatedEntity.java`](./UpdatedEntity.java)
- [`BaseEntity.java`](./BaseEntity.java)
- [`BaseEntityListener.java`](./BaseEntityListener.java)
- [`IdGeneratable.java`](./IdGeneratable.java)
- [`ServiceProviderble.java`](./ServiceProviderble.java)
- [`UuidUtils.java`](./UuidUtils.java)
- [`PredicateBuilder.java`](./PredicateBuilder.java)
- [`BeanUtils.java`](./BeanUtils.java)
- [`ModelMapperUtil.java`](./ModelMapperUtil.java)
- [`CodeValue.java`](./CodeValue.java)
- [`BizEnum.java`](./BizEnum.java)
- [`CodeValueConverter.java`](./CodeValueConverter.java)
- [`PageQuery.java`](./PageQuery.java) — 목록 기본 size 20, 상한 100. 사용은 [유스케이스와 DTO](/docs/harness/templates/backend/spring/db-design/usecase-dto)

## Source

### 예외와 응답 코드

소스는 같은 폴더의 `.java` 파일을 원본으로 둡니다.
요약만 적습니다.

| 타입 | 역할 |
|---|---|
| `ResponseTypeInterface` | 공통, 모듈 이넘이 구현하는 계약 (`code`, `desc`, `httpStatus`) |
| `ResponseType` | 시스템 공통 코드만 |
| `BizException` | Error/Warn 부모. `ResponseTypeInterface`만 받음 |
| `BizErrorException` / `BizWarnException` | 던지는 구현체 |
| `CommonExceptionAdvice` | Biz와 검증 실패를 `CommonResponse`로 변환 |

```java
throw new BizErrorException(ResponseType.NOT_FOUND_RESOURCE);
throw new BizWarnException(ResponseType.INVALID_PARAMETER);
```

모듈 전용 코드는 3차에서 각 API 모듈 이넘으로 분리합니다.
지금은 공통 `ResponseType`만 템플릿에 둡니다.

### `CreatedEntity.java`

```java
package com.example.template.support;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.experimental.FieldNameConstants;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@FieldNameConstants
public abstract class CreatedEntity extends BaseEntity {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "created_by", nullable = false, updatable = false, length = 255)
    @CreatedBy
    private String createdBy;

}
```

### `UpdatedEntity.java`

```java
package com.example.template.support;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.experimental.FieldNameConstants;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@FieldNameConstants
public abstract class UpdatedEntity extends CreatedEntity {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "updated_at", nullable = false)
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", nullable = false, length = 255)
    @LastModifiedBy
    private String updatedBy;

    @Version
    @Column(name = "version", nullable = false)
    private Integer version;

}
```

원셋 `ExampleItem`은 `CreatedEntity`만 상속합니다.
수정 감사가 필요하면 `UpdatedEntity`로 바꾸고 테이블에 `updated_at` / `updated_by` / `version`을 둡니다.

### `BaseEntity.java`

```java
package com.example.template.support;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners({AuditingEntityListener.class, BaseEntityListener.class})
public abstract class BaseEntity {
}
```

### `BaseEntityListener.java`

```java
package com.example.template.support;

import jakarta.persistence.PrePersist;

import java.util.UUID;

public class BaseEntityListener {

    @PrePersist
    public void prePersist(Object o) {
        if (o instanceof ServiceProviderble) {
            // Host: ((ServiceProviderble) o).setServiceId(WebUtils.getServiceId());
        }

        if (o instanceof IdGeneratable obj) {
            obj.setId(UuidUtils.uuidToBase64(UUID.randomUUID()));
        }
    }
}
```

### `IdGeneratable.java` / `ServiceProviderble.java` / `UuidUtils.java`

소스는 같은 폴더의 `.java` 파일을 봅니다.
`IdGeneratable`은 String PK 자동 생성, `ServiceProviderble`은 서비스 id 주입 훅입니다.

### `PredicateBuilder.java`

```java
package com.example.template.support;

import jakarta.persistence.criteria.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class PredicateBuilder {

    private CriteriaBuilder criteriaBuilder;
    private Root<?> root;
    private final List<Predicate> predicates = new ArrayList<>();

    public PredicateBuilder(CriteriaBuilder criteriaBuilder, Root<?> root) {
        this.criteriaBuilder = criteriaBuilder;
        this.root = root;
    }

    public static PredicateBuilder builder(CriteriaBuilder criteriaBuilder, Root<?> root) {
        return new PredicateBuilder(criteriaBuilder, root);
    }

    public PredicateBuilder equal(String property, Object value) {
        if (value != null) {
            predicates.add(criteriaBuilder.equal(root.get(property), value));
        }
        return this;
    }

    public PredicateBuilder isNotNull(String property) {
        predicates.add(criteriaBuilder.isNotNull(root.get(property)));
        return this;
    }

    public PredicateBuilder like(String property, String value) {
        if (value != null && !value.isEmpty()) {
            predicates.add(criteriaBuilder.like(root.get(property), "%" + value + "%"));
        }
        return this;
    }

    public PredicateBuilder in(String property, Collection<?> values) {
        if (values != null && !values.isEmpty()) {
            predicates.add(root.get(property).in(values));
        }
        return this;
    }

    public PredicateBuilder notIn(String property, Collection<?> values) {
        if (values != null && !values.isEmpty()) {
            predicates.add(criteriaBuilder.not(root.get(property).in(values)));
        }
        return this;
    }

    public PredicateBuilder bitAnd(String property, Integer value) {
        if (value != null) {
            Path<Integer> path = root.get(property);
            Expression<Integer> expression = criteriaBuilder.function("bitand", Integer.class, path, criteriaBuilder.literal(value));
            predicates.add(criteriaBuilder.equal(expression, value));
        }
        return this;
    }

    public PredicateBuilder bitOr(String property, Integer value) {
        if (value != null) {
            Path<Integer> path = root.get(property);
            Expression<Integer> expression = criteriaBuilder.function("bitor", Integer.class, path, criteriaBuilder.literal(value));
            predicates.add(criteriaBuilder.equal(expression, value));
        }
        return this;
    }

    public PredicateBuilder bitXor(String property, Integer value) {
        if (value != null) {
            Path<Integer> path = root.get(property);
            Expression<Integer> expression = criteriaBuilder.function("bitxor", Integer.class, path, criteriaBuilder.literal(value));
            predicates.add(criteriaBuilder.equal(expression, value));
        }
        return this;
    }

    public PredicateBuilder endWidth(String property, String value) {
        if (value != null && !value.isEmpty()) {
            predicates.add(criteriaBuilder.like(root.get(property), "%" + value ));
        }
        return this;
    }

    public PredicateBuilder startWidth(String property, String value) {
        if (value != null && !value.isEmpty()) {
            predicates.add(criteriaBuilder.like(root.get(property), value + "%"));
        }
        return this;
    }

    public PredicateBuilder or(Predicate... predicate) {
        if (predicate != null) {
            predicates.add(criteriaBuilder.or(predicate));
        }
        return this;
    }

    public PredicateBuilder regex(String property, String regex) {
        if (regex != null && !regex.isEmpty()) {
            Expression<Boolean> regexExpression = criteriaBuilder.function("regexp", Boolean.class, root.get(property), criteriaBuilder.literal(regex));
            predicates.add(criteriaBuilder.isTrue(regexExpression));
        }
        return this;
    }

    public PredicateBuilder loe(String property, LocalDateTime value) {
        if (value != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(property), value));
        }
        return this;
    }

    public PredicateBuilder goe(String property, LocalDateTime value) {
        if (value != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(property), value));
        }
        return this;
    }


    public PredicateBuilder loe(String property, String value) {
        if (value != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(property), value));
        }
        return this;
    }

    public PredicateBuilder goe(String property, String value) {
        if (value != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(property), value));
        }
        return this;
    }

    //gt
    public PredicateBuilder gt(String property, Integer value) {
        if (value != null) {
            predicates.add(criteriaBuilder.greaterThan(root.get(property), value));
        }
        return this;
    }


    public Predicate build() {
        if (predicates.isEmpty()) {
            return criteriaBuilder.conjunction();
        }
        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
```

### `BeanUtils.java`

```java
package com.example.template.support;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.*;

public class BeanUtils {

    public static void map(Object source, Object destination) {
        map(source, destination, null, null);
    }

    public static void mapWithIgnoreFields(Object source, Object destination, List<String> ignoreFields) {
        map(source, destination, ignoreFields, null);
    }

    public static void mapWithNullableFields(Object source, Object destination, List<String> nullableFields) {
        map(source, destination, null, nullableFields);
    }

    public static void map(Object source, Object destination, List<String> ignoreFields, List<String> nullableFields) {
        Set<String> ignoreSet = new HashSet<>(Optional.ofNullable(ignoreFields).orElse(Collections.emptyList()));

        Class<?> sourceClass = source.getClass();
        Class<?> destinationClass = destination.getClass();

        Field[] sourceFields = sourceClass.getDeclaredFields();
        Field[] destinationFields = destinationClass.getDeclaredFields();

        for (Field sourceField : sourceFields) {

            if (ignoreSet.contains(sourceField.getName())) {
                continue;
            }

            if (isAnnotatedWith(sourceField, OneToMany.class) || isAnnotatedWith(sourceField, OneToOne.class)) {
                continue;
            }

            for (Field destinationField : destinationFields) {
                if (sourceField.getName().equals(destinationField.getName())) {
                    sourceField.setAccessible(true);
                    destinationField.setAccessible(true);
                    try {
                        Object value = sourceField.get(source);

                        boolean allowNullable = !CollectionUtils.isEmpty(nullableFields) && nullableFields.contains(sourceField.getName());
                        if (!allowNullable && value == null) break;

                        // 공백 문자열은 "수정 안 함"으로 취급 (부분 업데이트 안정성 강화)
                        if (!allowNullable && value instanceof String str && !StringUtils.hasText(str)) break;

                        Class<?> destinationType = destinationField.getType();

                        if (value == null || destinationType.isAssignableFrom(value.getClass())) {
                            destinationField.set(destination, value);
                            break;
                        }

                        // String code -> BizEnum 변환 지원 (ex: EnStatus.of("A"))
                        if (value instanceof String code && destinationType.isEnum()) {
                            Method ofMethod = destinationType.getMethod("of", String.class);
                            Object enumValue = ofMethod.invoke(null, code);
                            destinationField.set(destination, enumValue);
                            break;
                        }
                    } catch (ReflectiveOperationException e) {
                        throw new IllegalArgumentException(
                                "Bean mapping failed for field: " + sourceField.getName(),
                                e
                        );
                    }
                }
            }
        }
    }

    public static Map<String, Object> diff(Object oldObj, Object newObj)  {
        return diff(oldObj, newObj, false);
    }

    public static Map<String, Object> diff(Object oldObj, Object newObj, boolean nullSkip)  {
        Map<String, Object> diffMap = new HashMap<>();

        // 동일한 클래스 타입인지 확인
        if (!oldObj.getClass().equals(newObj.getClass())) {
            throw new IllegalArgumentException("Objects must be of the same type");
        }

        // 클래스의 모든 필드를 가져옴
        Field[] fields = oldObj.getClass().getDeclaredFields();

        try {
            for (Field field : fields) {
                field.setAccessible(true);
                Object oldValue = field.get(oldObj);
                Object newValue = field.get(newObj);

                if (nullSkip && oldValue == null) {
                    continue;
                }

                if (isAnnotatedWith(field, OneToMany.class) || isAnnotatedWith(field, ManyToOne.class)) {
                    continue;
                }

                if (newValue != null && (oldValue == null || !oldValue.equals(newValue))) {
                    diffMap.put(field.getName(), newValue);
                }
            }
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }

        return diffMap;
    }

    private static boolean isAnnotatedWith(Field field, Class<? extends Annotation> annotationClass) {
        return field.isAnnotationPresent(annotationClass);
    }
}
```

### `ModelMapperUtil.java`

```java
package com.example.template.support;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.config.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.util.CollectionUtils;

import javax.print.attribute.standard.Destination;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static org.modelmapper.convention.MatchingStrategies.STRICT;

public class ModelMapperUtil {
    protected final Logger log = LoggerFactory.getLogger(getClass());

    public static ModelMapper modelMapper = new ModelMapper();

    static {
        modelMapper.getConfiguration()
                .setMatchingStrategy(STRICT)
                .setFieldAccessLevel(Configuration.AccessLevel.PRIVATE)
                .setSkipNullEnabled(true)
                .setFieldMatchingEnabled(true);
    }

    public static <D> D map(Object source, Class<D> destinationType) {
        if (source == null) return null;
        return modelMapper.map(source, destinationType);
    }

    //    public static <D> D map(Object source, Class<D> destinationType, String typeMapName) {
//        if(source == null) return null;
//        return modelMapper.map(source, destinationType, typeMapName);
//    }
//
    public static void map(Object source, Object destination) {
        modelMapper.map(source, destination);
    }

//    public static void map(Object source, Object destination, String typeMapName) {
//        modelMapper.map(source, destination, typeMapName);
//    }

//    public static <D> D map(Object source, Type destinationType) {
//        return modelMapper.map(source, destinationType);
//    }

//    public static <D> D map(Object source, Type destinationType, String typeMapName) {
//        return modelMapper.map(source, destinationType, typeMapName);
//    }

    public static <D, T> List<D> mapAll(Collection<T> sourceList, Class<D> destinationType) {
        if (CollectionUtils.isEmpty(sourceList))
            return List.of();
        return sourceList.stream()
                .map(source -> map(source, destinationType))
                .collect(Collectors.toList());
    }

//    public static void apply(Collection<?> sourceList, Class<?> destinationType) {
//        if (CollectionUtils.isEmpty(sourceList)) return;
//        ApplyHolder.addApply();
//        sourceList.forEach(source -> {
//            if (destinationType.isAssignableFrom(source.getClass())) {
//
//            }
//        });
//    }

    public static <D, T> Page<D> mapAll(Page<T> page, Class<D> destinationType) {
        return page.map(e -> map(e, destinationType));
    }


}
```

### `CodeValue.java`

```java
package com.example.template.support;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public interface CodeValue  {
    String getCode();
    String getValue();

}
```

### `BizEnum.java`

```java
package com.example.template.support;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.SOURCE)
public @interface BizEnum {
    boolean value() default true;
}
```

### `CodeValueConverter.java`

```java
package com.example.template.support;

import jakarta.persistence.AttributeConverter;
import lombok.extern.slf4j.Slf4j;

import java.util.EnumSet;

@Slf4j
public abstract class CodeValueConverter<E extends Enum<E> & CodeValue> implements AttributeConverter<E, String> {

    abstract protected Class<E> support();

    @Override
    public String convertToDatabaseColumn(E attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public E convertToEntityAttribute(String dbData) {
        log.debug("dbData: {}", dbData, "class: {}", support());
        if (dbData == null) {
            return null;
        }
        return EnumSet.allOf(support()).stream()
                .filter(e -> e.getCode().equals(dbData))
                .findAny()
                .orElseThrow(() -> new BizErrorException(ResponseType.INVALID_ENUM_VALUE).addData("code", dbData));
    }
}
```
