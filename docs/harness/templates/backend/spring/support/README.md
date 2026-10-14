# Support template

> **개요:** 테이블 세트와 이넘 세트가 호출하는 지원 타입 전체입니다.

호스트에 같은 역할의 클래스가 있으면 호스트 클래스를 씁니다.
`BaseEntity`는 감사 리스너만 등록합니다.
호스트는 여기에 `BaseEntityListener`를 더 등록할 수 있습니다.
`CodeValueConverter.convertToEntityAttribute`의 예외는 호스트의 열거형 오류 예외로 바꿉니다.

## Files

- [`CommonResponse.java`](./CommonResponse.java)
- [`CommonResponseUtils.java`](./CommonResponseUtils.java)
- [`BizErrorException.java`](./BizErrorException.java)
- [`ResponseType.java`](./ResponseType.java)
- [`CreatedEntity.java`](./CreatedEntity.java)
- [`BaseEntity.java`](./BaseEntity.java)
- [`PredicateBuilder.java`](./PredicateBuilder.java)
- [`BeanUtils.java`](./BeanUtils.java)
- [`ModelMapperUtil.java`](./ModelMapperUtil.java)
- [`CodeValue.java`](./CodeValue.java)
- [`BizEnum.java`](./BizEnum.java)
- [`CodeValueConverter.java`](./CodeValueConverter.java)

## Source

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

    public BizErrorException addData(String key, Object value) {
        if (data == null) {
            data = new java.util.HashMap<>();
        }
        data.put(key, value);
        return this;
    }

    public java.util.Map<String, Object> getData() {
        return data;
    }

    private java.util.Map<String, Object> data;
}
```

### `ResponseType.java`

```java
package com.example.template.support;

public enum ResponseType {
    NOT_FOUND_RESOURCE,
    UNDEFINED,
    INVALID_ENUM_VALUE,
    NOT_ALLOWED_ENUM_VALUE
}
```

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

### `BaseEntity.java`

```java
package com.example.template.support;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
}
```

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
