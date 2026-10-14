# Enum apply template

> **개요:** 테이블 세트의 컬럼 하나에 @BizEnum 열거형을 적용한 전체 예제와 주의점입니다.

이 폴더는 테이블 템플릿의 `httpMethod` 컬럼에 열거형을 적용한 전체 예제입니다.
DTO는 문자열입니다.
엔티티 필드만 열거형입니다.
서비스 메서드 목록은 테이블 템플릿과 같습니다.


서비스 `map` / `mapAll`은 `ModelMapperUtil` 입니다.
이넘 변환을 서비스 메서드에 새로 넣지 않습니다.
`BizEnumProcessor`가 생성한 `_열거형`의 static 블록이 `ModelMapperUtil.modelMapper.addConverter`를 두 번 등록합니다.
이넘에서 문자열은 `getCode()` 입니다.
문자열에서 이넘은 `of(code)` 입니다.
null은 null입니다.
이넘의 `static \{ new _열거형이름(); \}` 이 그 등록을 `map` / `mapAll`보다 먼저 실행합니다.


테이블 전용 열거형은 `application.\{도메인\}.enums` 입니다.
`EnHttpMethod`가 그 예제입니다.
공유 열거형은 `application.shared.enums` 입니다.
`EnYn`은 `Y`/`N`, `EnStatus`는 `A` 활성 / `D` 비활성입니다.

## 주의

상수 아래에 `static \{ new _열거형이름(); \}` 을 둡니다.
이 줄이 생성된 컨버터를 올려 `ModelMapper` 변환을 등록합니다.

`_열거형이름.java`는 소스에 두지 않습니다.
아래 생성 결과는 컴파일러가 `build/generated/sources/annotationProcessor/java/main`에 만드는 파일입니다.
같은 이름 파일은 다시 컴파일하면 갱신됩니다.
이넘을 지우거나 이름을 바꾸면 예전 `_열거형이름.java`는 자동으로 지워지지 않습니다.
`clean` 다음에 다시 빌드해야 사라집니다.

프로세서와 `@BizEnum` 이넘을 같은 `compileJava`에만 두면 프로세서가 실행되지 않습니다.
프로세서를 먼저 컴파일하고, 그 결과와 `spring-core`를 메인 `annotationProcessor`에 올립니다.
`org.springframework.javapoet`는 `spring-core` 안에 있습니다.

```gradle
sourceSets {
    bizEnumProcessor {
        java {
            srcDir 'src/main/java'
            include 'com/example/template/processor/**'
            include 'com/example/template/support/CodeValue.java'
        }
    }
}

dependencies {
    bizEnumProcessorCompileOnly 'org.springframework:spring-core'
    bizEnumProcessorCompileOnly 'com.google.auto.service:auto-service-annotations:1.1.1'
    bizEnumProcessorAnnotationProcessor 'com.google.auto.service:auto-service:1.1.1'
    annotationProcessor sourceSets.bizEnumProcessor.output
    annotationProcessor 'org.springframework:spring-core'
}
```

이 예제의 프로세서 패키지는 `com.example.template.processor` 입니다.
호스트에 프로세서가 이미 있으면 include만 그 패키지와 `CodeValue` 파일로 바꿉니다.
`ClassName.get`의 `ModelMapperUtil`, `CodeValueConverter` 패키지도 호스트 패키지로 바꿉니다.

파사드는 호출마다 `of` 또는 `ofNullable`로 열거형을 얻은 뒤 `getCode()`만 DTO에 다시 넣습니다.
검사만 하고 버리는 헬퍼는 두지 않습니다.
없을 수 있는 조회와 수정은 `ofNullable`, 필수 저장은 `of` 입니다.
스펙의 동등 조건에는 문자열이 아니라 `ofNullable`이 반환한 열거형을 넘깁니다.
`name()`을 저장값으로 쓰지 않습니다.
코드가 숫자로 시작할 수 있기 때문입니다.

## 빌드가 만드는 파일

경로 예시는 `build/generated/sources/annotationProcessor/java/main/com/example/template/restoutlog/enums/_EnHttpMethod.java` 입니다.
이 파일을 소스 트리에 복사하지 않습니다.
`EnYn`, `EnStatus`도 같은 방식으로 `_EnYn.java`, `_EnStatus.java`가 생깁니다.

```java
package com.example.template.restoutlog.enums;

import com.example.template.support.CodeValueConverter;
import com.example.template.support.ModelMapperUtil;
import jakarta.persistence.Converter;
import java.lang.Class;
import java.lang.Override;
import java.lang.String;
import org.modelmapper.AbstractConverter;

@Converter(
    autoApply = true
)
public class _EnHttpMethod extends CodeValueConverter<EnHttpMethod> {
  static {
    ModelMapperUtil.modelMapper.addConverter(new AbstractConverter<EnHttpMethod, String>() {
    @Override
    protected String convert(EnHttpMethod e) {
    return e != null ? e.getCode() : null;

    }});
    ModelMapperUtil.modelMapper.addConverter(new AbstractConverter<String, EnHttpMethod>() {
    @Override
    protected EnHttpMethod convert(String code) {
    if(code == null) return null;
    return EnHttpMethod.of(code);
    }
    });
  }

  @Override
  protected Class support() {
    return EnHttpMethod.class;
  }
}
```

## Files

- [`BizEnumProcessor.java`](./BizEnumProcessor.java)
- [`ModelMapperUtil.java`](../support/ModelMapperUtil.java)
- [`EnHttpMethod.java`](./EnHttpMethod.java)
- [`EnYn.java`](./EnYn.java)
- [`EnStatus.java`](./EnStatus.java)
- [`RestOutLog.java`](./RestOutLog.java)
- [`RestOutLogFacade.java`](./RestOutLogFacade.java)
- [`RestOutLogSpecs.java`](./RestOutLogSpecs.java)
- [`RestOutLogReq.java`](./RestOutLogReq.java)
- [`RestOutLogRes.java`](./RestOutLogRes.java)
- [`RestOutLogService.java`](./RestOutLogService.java)
- [`RestOutLogRepository.java`](./RestOutLogRepository.java)
- [`RestOutLogController.java`](./RestOutLogController.java)

## Source

### `BizEnumProcessor.java`

```java
package com.example.template.processor;

import com.example.template.support.BizEnum;
import com.google.auto.service.AutoService;
import com.example.template.support.CodeValue;
import org.springframework.javapoet.*;

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.*;
import javax.lang.model.type.TypeMirror;
import javax.tools.Diagnostic;
import java.io.IOException;
import java.util.Map;
import java.util.Set;

@SupportedSourceVersion(SourceVersion.RELEASE_17)
@AutoService(Processor.class)
public class BizEnumProcessor extends AbstractProcessor {

    // 이 프로세서가 어떤 애노테이션을 처리 할 것 인지 정하는 메소드
    @Override
    public Set<String> getSupportedAnnotationTypes() {
        return Set.of(BizEnum.class.getName());
    }

    // 해당 애노테이션으로 작업을 처리하는 메소드
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        // 해당 애노테이션이 붙어 있는 엘리먼트들을 가져 온다.
        // Element : 클래스, 인터페이스, 메소드 등 애노테이션을 붙일 수 있는 target
        Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(BizEnum.class);
        for (Element element : elements) {

            // Element가 Enum 타입인지 확인합니다.
            if (!(element instanceof TypeElement) || element.getKind() != ElementKind.ENUM) {
                processingEnv.getMessager().printMessage(Diagnostic.Kind.ERROR, "@BizEnum annotation can only be applied to enums.");
                return false;
            }

            // Element가 Enum 타입이고, 특정 인터페이스를 상속받았는지 확인합니다.
            TypeElement enumElement = (TypeElement) element;
            if (!implementsInterface(enumElement, CodeValue.class)) {
                processingEnv.getMessager().printMessage(Diagnostic.Kind.ERROR,
                        "@BizEnum must implement CodeValue interface.");
                return false;
            }

            // Element가 Enum 타입이고, 특정 메소드를 가지고 있는지 확인합니다.
            if (!hasMethod(enumElement, "of", String.class)) {
                processingEnv.getMessager().printMessage(Diagnostic.Kind.ERROR,
                        "@BizEnum must have a 'of(String code)' method.");
                return false;
            }

            // @BizEnum 애노테이션의 값을 가져오기
            boolean isCreateConverter = true;

            AnnotationMirror annotationMirror = getAnnotationMirror(element, BizEnum.class);
            if (annotationMirror != null) {
                AnnotationValue value = getAnnotationValue(annotationMirror, "value");
                    isCreateConverter =  (Boolean)value.getValue();
            }

            // 해당 Element 이름
            Name simpleName = element.getSimpleName();

            processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Processing " + simpleName);

            TypeElement typeElement = (TypeElement) element;
            ClassName className = ClassName.get(typeElement);
            String packageName = processingEnv.getElementUtils().getPackageOf(typeElement).getQualifiedName().toString();
            String enumQualifiedName = typeElement.getQualifiedName().toString();

//            // MethodSpec: Method 만드는 객체
//            MethodSpec pullout = MethodSpec.methodBuilder("pullOut")
//                    .addModifiers(Modifier.PUBLIC)          // 접근 제한자 설정
//                    .returns(String.class)                  // Method return Type 설정
//                    .addStatement("return $S", "Rabiit!")   // return 시 값 전달 설정
//                    .build();


            // Generate static block
            CodeBlock staticBlock = CodeBlock.builder()
                    .add("$T.modelMapper.addConverter(new $T<$T, $T>() {",
                            ClassName.get("com.example.template.support", "ModelMapperUtil"),
                            ClassName.get("org.modelmapper", "AbstractConverter"),
                            ClassName.get(typeElement.asType()),
                            ClassName.get(String.class)
                    )
                    .add("\n")
                    .add("@Override")
                    .add("\n")
                    .add("protected $T convert($T e) {",
                            String.class,
                            ClassName.get(typeElement.asType())
                     )
                    .add("\n")
                    .addStatement("return e != null ? e.getCode() : null")
                    .add("\n")
                    .add("}")
                    .addStatement("})")


                    .add("$T.modelMapper.addConverter(new $T<$T, $T>() {",
//                            ClassName.get("ai.farmpro.drp.lib.common.util", "ModelMapperUtil"),
                            ClassName.get("com.example.template.support", "ModelMapperUtil"),
                            ClassName.get("org.modelmapper", "AbstractConverter"),
                            ClassName.get(String.class),
                            ClassName.get(typeElement.asType())
                     )
                    .add("\n")
                    .add("@Override")
                    .add("\n")
                    .add("protected $T convert($T code) {", ClassName.get(typeElement.asType()), String.class)
                    .add("\n")
                    .add("if(code == null) return null;")
                    .add("\n")
                    .add("return $T.of(code);", ClassName.get(typeElement.asType()))
                    .add("\n")
                    .add("}")
                    .add("\n")
                    .addStatement("})")
                    .build();


            TypeSpec converterTypeSpec = null;

            if (isCreateConverter) {
                converterTypeSpec = TypeSpec.classBuilder( "_" + simpleName.toString())
                        .addModifiers(Modifier.PUBLIC) // 접근 제한자 설정
                        .addAnnotation(AnnotationSpec.builder(ClassName.get("jakarta.persistence", "Converter"))
                                .addMember("autoApply", "$L", true)
                                .build())
//                        .superclass(ParameterizedTypeName.get(ClassName.get("ai.mintit.drp.lib.common.converter", "CodeValueConverter"),
//                                ClassName.get("", simpleName.toString())))
                        .superclass(ParameterizedTypeName.get(ClassName.get("com.example.template.support", "CodeValueConverter"),
                                ClassName.get("", simpleName.toString())))
                        .addMethod(MethodSpec.methodBuilder("support")
                                .addAnnotation(Override.class)
                                .addModifiers(Modifier.PROTECTED)
                                .returns(Class.class)
                                .addStatement("return $T.class", ClassName.get("", simpleName.toString()))
                                .build())
                        .addStaticBlock(staticBlock)
                        .build();

            } else {
                converterTypeSpec = TypeSpec.classBuilder( "_" + simpleName.toString())
                        .addModifiers(Modifier.PUBLIC) // 접근 제한자 설정
                        .addStaticBlock(staticBlock)
                        .build();
            }

            // TypeSpec : Type 만드는 객체
// EnAtmStatusConverter 클래스를 기반으로 TypeSpec을 만듭니다.

            Filer filer = processingEnv.getFiler();

            try {
                JavaFile.builder(className.packageName(), converterTypeSpec)
                        .build()
                        .writeTo(filer);
            } catch (IOException e) {
                processingEnv.getMessager().printMessage(Diagnostic.Kind.ERROR, "FATAL ERROR : " + e);
            }
        }

        /*
          true 일 경우 해당 애노테이션에 대한 다른 프로세서한테 더이상 처리하지 말라고 한다.
          false 일 경우 또 다른 프로세서가 처리 할 수 있음.
        */
        return true;
    }

    // Element가 특정 인터페이스를 상속받았는지 확인하는 메소드
    private boolean implementsInterface(TypeElement element, Class<?> interfaceClass) {
        for (TypeMirror interfaceType : element.getInterfaces()) {
            if (interfaceType.toString().startsWith(interfaceClass.getName())) {
                return true;
            }
        }
        return false;
    }


    // 특정 클래스 또는 인터페이스에 특정 메소드가 있는지 확인하는 메소드
    private boolean hasMethod(TypeElement element, String methodName, Class<?>... parameterTypes) {
        for (Element enclosedElement : element.getEnclosedElements()) {
            if (enclosedElement.getKind() == ElementKind.METHOD &&
                    enclosedElement.getSimpleName().contentEquals(methodName)) {
                ExecutableElement methodElement = (ExecutableElement) enclosedElement;
                // 메소드 파라미터 타입 체크
                if (parametersMatch(methodElement, parameterTypes)) {
                    return true; // 메소드 이름과 파라미터 타입이 일치하면 true 반환
                }
            }
        }
        return false; // 해당 메소드를 찾지 못한 경우 false 반환
    }

    private boolean parametersMatch(ExecutableElement methodElement, Class<?>... parameterTypes) {
        if (methodElement.getParameters().size() != parameterTypes.length) {
            return false; // 파라미터 개수가 다르면 false 반환
        }
        for (int i = 0; i < parameterTypes.length; i++) {
            if (!methodElement.getParameters().get(i).asType().toString().equals(parameterTypes[i].getName())) {
                return false; // 파라미터 타입이 다르면 false 반환
            }
        }
        return true; // 모든 파라미터 타입이 일치하면 true 반환
    }

    // Element에서 AnnotationMirror 가져오는 메소드
    private AnnotationMirror getAnnotationMirror(Element element, Class<?> annotationClass) {
        for (AnnotationMirror annotationMirror : element.getAnnotationMirrors()) {
            if (annotationMirror.getAnnotationType().toString().equals(annotationClass.getName())) {
                return annotationMirror;
            }
        }
        return null;
    }

    // AnnotationMirror에서 AnnotationValue 가져오는 메소드
    private AnnotationValue getAnnotationValue(AnnotationMirror annotationMirror, String key) {
        for (Map.Entry<? extends ExecutableElement, ? extends AnnotationValue> entry :
                processingEnv.getElementUtils().getElementValuesWithDefaults(annotationMirror).entrySet()) {
            if (entry.getKey().getSimpleName().toString().equals(key)) {
                return entry.getValue();
            }
        }
        return null;
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

### `EnHttpMethod.java`

```java
package com.example.template.restoutlog.enums;

import com.example.template.support.CodeValue;
import com.example.template.support.BizErrorException;
import com.example.template.support.BizEnum;
import com.example.template.support.ResponseType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Arrays;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@BizEnum
public enum EnHttpMethod implements CodeValue {

    GET("GET", "GET"),
    HEAD("HEAD", "HEAD"),
    POST("POST", "POST"),
    PUT("PUT", "PUT"),
    PATCH("PATCH", "PATCH"),
    DELETE("DELETE", "DELETE"),
    OPTIONS("OPTIONS", "OPTIONS"),
    TRACE("TRACE", "TRACE"),
    ;

    static {
        new _EnHttpMethod();
    }

    final String code;
    final String value;

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getValue() {
        return value;
    }

    public static EnHttpMethod of(String code) {
        return Arrays.stream(EnHttpMethod.values())
                .filter(v -> v.getCode().equals(code))
                .findAny()
                .orElseThrow(() ->
                        new BizErrorException(ResponseType.INVALID_ENUM_VALUE)
                                .addData("code", code)
                                .addData("values", Arrays.stream(values()).collect(Collectors.toMap(CodeValue::getCode, CodeValue::getValue)))
                );
    }

    public static EnHttpMethod ofNullable(String code, EnHttpMethod... allowStatus) {
        if (code == null) {
            return null;
        }
        if (allowStatus != null && allowStatus.length > 0) {
            if (Arrays.stream(allowStatus).noneMatch(v -> v.getCode().equals(code))) {
                throw new BizErrorException(ResponseType.NOT_ALLOWED_ENUM_VALUE)
                        .addData("code", code)
                        .addData("values", Arrays.stream(allowStatus).collect(Collectors.toMap(CodeValue::getCode, CodeValue::getValue)));
            }
        }
        return of(code);
    }
}
```

### `EnYn.java`

```java
package com.example.template.shared.enums;

import com.example.template.support.CodeValue;
import com.example.template.support.BizErrorException;
import com.example.template.support.BizEnum;
import com.example.template.support.ResponseType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Arrays;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@BizEnum
public enum EnYn implements CodeValue {

    Y("Y", "Y"),
    N("N", "N"),
    ;

    static {
        new _EnYn();
    }

    final String code;
    final String value;

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getValue() {
        return value;
    }

    public static EnYn of(String code) {
        return Arrays.stream(EnYn.values())
                .filter(v -> v.getCode().equals(code))
                .findAny()
                .orElseThrow(() ->
                        new BizErrorException(ResponseType.INVALID_ENUM_VALUE)
                                .addData("code", code)
                                .addData("values", Arrays.stream(values()).collect(Collectors.toMap(CodeValue::getCode, CodeValue::getValue)))
                );
    }

    public static EnYn ofNullable(String code, EnYn... allowStatus) {
        if (code == null) {
            return null;
        }
        if (allowStatus != null && allowStatus.length > 0) {
            if (Arrays.stream(allowStatus).noneMatch(v -> v.getCode().equals(code))) {
                throw new BizErrorException(ResponseType.NOT_ALLOWED_ENUM_VALUE)
                        .addData("code", code)
                        .addData("values", Arrays.stream(allowStatus).collect(Collectors.toMap(CodeValue::getCode, CodeValue::getValue)));
            }
        }
        return of(code);
    }
}
```

### `EnStatus.java`

```java
package com.example.template.shared.enums;

import com.example.template.support.CodeValue;
import com.example.template.support.BizErrorException;
import com.example.template.support.BizEnum;
import com.example.template.support.ResponseType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Arrays;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@BizEnum
public enum EnStatus implements CodeValue {

    ACTIVATED("A", "활성"),
    DEACTIVATED("D", "비활성"),
    ;

    static {
        new _EnStatus();
    }

    final String code;
    final String value;

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getValue() {
        return value;
    }

    public static EnStatus of(String code) {
        return Arrays.stream(EnStatus.values())
                .filter(v -> v.getCode().equals(code))
                .findAny()
                .orElseThrow(() ->
                        new BizErrorException(ResponseType.INVALID_ENUM_VALUE)
                                .addData("code", code)
                                .addData("values", Arrays.stream(values()).collect(Collectors.toMap(CodeValue::getCode, CodeValue::getValue)))
                );
    }

    public static EnStatus ofNullable(String code, EnStatus... allowStatus) {
        if (code == null) {
            return null;
        }
        if (allowStatus != null && allowStatus.length > 0) {
            if (Arrays.stream(allowStatus).noneMatch(v -> v.getCode().equals(code))) {
                throw new BizErrorException(ResponseType.NOT_ALLOWED_ENUM_VALUE)
                        .addData("code", code)
                        .addData("values", Arrays.stream(allowStatus).collect(Collectors.toMap(CodeValue::getCode, CodeValue::getValue)));
            }
        }
        return of(code);
    }
}
```

### `RestOutLog.java`

```java
package com.example.template.restoutlog.entity;

import com.example.template.restoutlog.enums.EnHttpMethod;
import com.example.template.support.CreatedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;
import org.hibernate.annotations.DynamicInsert;

import static lombok.AccessLevel.PROTECTED;

/**
 * REST outbound 호출 로그. {@code createdAt}/{@code createdBy}는 {@link CreatedEntity} 상속.
 *
 * @see db/init/01_init.sql
 */
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
@Getter
@Setter
@Entity
@FieldNameConstants
@Table(name = "le_rest_out_log", indexes = {
        @Index(name = "ix_le_rest_out_log_response_http_status", columnList = "response_http_status"),
        @Index(name = "ix_le_rest_out_log_url", columnList = "url")
})
@DynamicInsert
public class RestOutLog extends CreatedEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "http_method", nullable = false, length = 10)
    private EnHttpMethod httpMethod;

    @Column(name = "url", nullable = false, length = 255)
    private String url;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "parameter")
    private String parameter;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "payload")
    private String payload;

    @Column(name = "response_http_status", nullable = false, length = 3)
    private String responseHttpStatus;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "response")
    private String response;

    public void delete() {
    }
}
```

### `RestOutLogFacade.java`

```java
package com.example.template.restoutlog.facade;

import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.dto.RestOutLogRes;
import com.example.template.restoutlog.enums.EnHttpMethod;
import com.example.template.restoutlog.service.RestOutLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@Transactional(readOnly = true, transactionManager = "transactionManager")
public class RestOutLogFacade {

    private final RestOutLogService restOutLogService;

    public Page<RestOutLogRes.Item> search(RestOutLogReq.Filter filter, Pageable pageable) {
        if (filter != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(filter.getHttpMethod());
            filter.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        return restOutLogService.search(filter, pageable);
    }

    @Transactional
    public RestOutLogRes.Id save(RestOutLogReq.Create create) {
        create.setHttpMethod(EnHttpMethod.of(create.getHttpMethod()).getCode());
        return restOutLogService.save(create);
    }

    @Transactional
    public List<RestOutLogRes.Id> saveAll(List<RestOutLogReq.Create> createList) {
        if (createList != null) {
            createList.forEach(create -> create.setHttpMethod(EnHttpMethod.of(create.getHttpMethod()).getCode()));
        }
        return restOutLogService.saveAll(createList);
    }

    public RestOutLogRes.Item findById(Long id) {
        return restOutLogService.findById(id);
    }

    @Transactional
    public RestOutLogRes.Id saveById(Long id, RestOutLogReq.Update update) {
        if (update != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(update.getHttpMethod());
            update.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        return restOutLogService.saveById(id, update);
    }

    @Transactional
    public void deleteById(Long id) {
        restOutLogService.deleteById(id);
    }

    public List<RestOutLogRes.Item> findAll(RestOutLogReq.Filter filter) {
        if (filter != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(filter.getHttpMethod());
            filter.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        return restOutLogService.findAll(filter);
    }

    public List<RestOutLogRes.Item> findByIds(List<Long> ids) {
        return restOutLogService.findByIds(ids);
    }

    public Page<RestOutLogRes.Name> searchName(RestOutLogReq.Filter filter, Pageable pageable) {
        if (filter != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(filter.getHttpMethod());
            filter.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        return restOutLogService.searchName(filter, pageable);
    }

    public List<RestOutLogRes.Name> findAllName(RestOutLogReq.Filter filter) {
        if (filter != null) {
            EnHttpMethod httpMethod = EnHttpMethod.ofNullable(filter.getHttpMethod());
            filter.setHttpMethod(httpMethod == null ? null : httpMethod.getCode());
        }
        return restOutLogService.findAllName(filter);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        restOutLogService.deleteByIds(ids);
    }
}
```

### `RestOutLogSpecs.java`

```java
package com.example.template.restoutlog.spec;

import com.example.template.restoutlog.enums.EnHttpMethod;
import com.example.template.support.CreatedEntity;
import com.example.template.support.PredicateBuilder;
import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.entity.RestOutLog;
import org.springframework.data.jpa.domain.Specification;

public class RestOutLogSpecs {

    public static Specification<RestOutLog> of(RestOutLogReq.Filter filter) {
        return (root, query, builder) -> {

            PredicateBuilder predicateBuilder = new PredicateBuilder(builder, root);

            predicateBuilder.equal(RestOutLog.Fields.id, filter.getId());
            predicateBuilder.in(RestOutLog.Fields.id, filter.getIds());
            predicateBuilder.goe(CreatedEntity.Fields.createdAt, filter.getStartAt());
            predicateBuilder.loe(CreatedEntity.Fields.createdAt, filter.getEndAt());
            predicateBuilder.equal(RestOutLog.Fields.httpMethod, EnHttpMethod.ofNullable(filter.getHttpMethod()));
            predicateBuilder.equal(RestOutLog.Fields.url, filter.getUrl());
            predicateBuilder.equal(RestOutLog.Fields.parameter, filter.getParameter());
            predicateBuilder.equal(RestOutLog.Fields.payload, filter.getPayload());
            predicateBuilder.equal(RestOutLog.Fields.responseHttpStatus, filter.getResponseHttpStatus());
            predicateBuilder.equal(RestOutLog.Fields.response, filter.getResponse());
            return predicateBuilder.build();
        };
    }
}
```

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

### `RestOutLogService.java`

```java
package com.example.template.restoutlog.service;

import com.example.template.support.BizErrorException;
import com.example.template.support.BeanUtils;
import com.example.template.support.ResponseType;
import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.dto.RestOutLogRes;
import com.example.template.restoutlog.entity.RestOutLog;
import com.example.template.restoutlog.repository.RestOutLogRepository;
import com.example.template.restoutlog.spec.RestOutLogSpecs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.template.support.ModelMapperUtil.map;
import static com.example.template.support.ModelMapperUtil.mapAll;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true, transactionManager = "transactionManager")
public class RestOutLogService {

    private final RestOutLogRepository restOutLogRepository;

    public Page<RestOutLogRes.Item> search(RestOutLogReq.Filter filter, Pageable pageable) {
        RestOutLog entity = map(filter, RestOutLog.class);
        Page<RestOutLog> page = restOutLogRepository.findAll(RestOutLogSpecs.of(filter), pageable);
        return mapAll(page, RestOutLogRes.Item.class);
    }

    @Transactional
    public RestOutLogRes.Id save(RestOutLogReq.Create create) {
        RestOutLog entity = map(create, RestOutLog.class);
        entity = restOutLogRepository.save(entity);
        return map(entity, RestOutLogRes.Id.class);
    }

    @Transactional
    public List<RestOutLogRes.Id> saveAll(List<RestOutLogReq.Create> createList) {
        if (createList == null || createList.isEmpty()) {
            return List.of();
        }
        List<RestOutLog> saveList = createList.stream()
                .map(item -> map(item, RestOutLog.class))
                .toList();
        return mapAll(restOutLogRepository.saveAll(saveList), RestOutLogRes.Id.class);
    }

    public RestOutLogRes.Item findById(Long id) {
        RestOutLog entity = restOutLogRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));
        return map(entity, RestOutLogRes.Item.class);
    }

    @Transactional
    public RestOutLogRes.Id saveById(Long id, RestOutLogReq.Update update) {
        RestOutLog entity = restOutLogRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.NOT_FOUND_RESOURCE));
        BeanUtils.map(update, entity);
        return map(entity, RestOutLogRes.Id.class);
    }

    @Transactional
    public void deleteById(Long id) {
        RestOutLog entity = restOutLogRepository.findById(id).orElseThrow(() -> new BizErrorException(ResponseType.UNDEFINED));
        entity.delete();
    }

    public List<RestOutLogRes.Item> findAll(RestOutLogReq.Filter filter) {
        return search(filter, Pageable.unpaged()).getContent();
    }

    public List<RestOutLogRes.Item> findByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        RestOutLogReq.Filter filter = new RestOutLogReq.Filter();
        filter.setIds(ids);
        return mapAll(restOutLogRepository.findAll(RestOutLogSpecs.of(filter)), RestOutLogRes.Item.class);
    }

    public Page<RestOutLogRes.Name> searchName(RestOutLogReq.Filter filter, Pageable pageable) {
        RestOutLog entity = map(filter, RestOutLog.class);
        Page<RestOutLog> page = restOutLogRepository.findAll(RestOutLogSpecs.of(filter), pageable);
        return mapAll(page, RestOutLogRes.Name.class);
    }

    public List<RestOutLogRes.Name> findAllName(RestOutLogReq.Filter filter) {
        RestOutLog entity = map(filter, RestOutLog.class);
        Page<RestOutLog> page = restOutLogRepository.findAll(RestOutLogSpecs.of(filter), Pageable.unpaged());
        return mapAll(page.stream().toList(), RestOutLogRes.Name.class);
    }

    @Transactional
    public void deleteByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        RestOutLogReq.Filter filter = new RestOutLogReq.Filter();
        filter.setIds(ids);
        restOutLogRepository.findAll(RestOutLogSpecs.of(filter)).forEach(RestOutLog::delete);
    }
}
```

### `RestOutLogRepository.java`

```java
package com.example.template.restoutlog.repository;

import com.example.template.restoutlog.entity.RestOutLog;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * RestOutLog Repository
 */
public interface RestOutLogRepository extends JpaRepository<RestOutLog, Long>, RestOutLogCustomRepository, JpaSpecificationExecutor<RestOutLog> {
}

@Repository
interface RestOutLogCustomRepository {
}

@RequiredArgsConstructor
class RestOutLogCustomRepositoryImpl implements RestOutLogCustomRepository {
    private final JPAQueryFactory queryFactory;
}
```

### `RestOutLogController.java`

```java
package com.example.template.restoutlog.entrance;

import com.example.template.restoutlog.dto.RestOutLogReq;
import com.example.template.restoutlog.dto.RestOutLogRes;
import com.example.template.restoutlog.facade.RestOutLogFacade;
import com.example.template.support.CommonResponseUtils;
import com.example.template.support.CommonResponse;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Hidden
@Tag(name = "RestOutLog", description = "le_rest_out_log")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/rest-out-logs")
public class RestOutLogController {

    private final RestOutLogFacade restOutLogFacade;

    @Operation(summary = "목록 조회")
    @GetMapping
    public CommonResponse<Page<RestOutLogRes.Item>> search(@ModelAttribute RestOutLogReq.Filter filter, Pageable pageable) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.search(filter, pageable));
    }

    @Operation(summary = "생성")
    @PostMapping
    public CommonResponse<RestOutLogRes.Id> save(@RequestBody RestOutLogReq.Create create) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.save(create));
    }

    @Operation(summary = "일괄 생성")
    @PostMapping("/save-all")
    public CommonResponse<List<RestOutLogRes.Id>> saveAll(@RequestBody List<RestOutLogReq.Create> createList) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.saveAll(createList));
    }

    @Operation(summary = "단건 조회")
    @GetMapping("/{id}")
    public CommonResponse<RestOutLogRes.Item> findById(@Parameter(description = "ID") @PathVariable(name = "id") Long id) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.findById(id));
    }

    @Operation(summary = "수정")
    @PutMapping("/{id}")
    public CommonResponse<RestOutLogRes.Id> saveById(@Parameter(description = "ID") @PathVariable(name = "id") Long id, @RequestBody RestOutLogReq.Update update) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.saveById(id, update));
    }

    @Operation(summary = "삭제")
    @DeleteMapping("/{id}")
    public CommonResponse<?> deleteById(@Parameter(description = "ID") @PathVariable(name = "id") Long id) {
        restOutLogFacade.deleteById(id);
        return CommonResponseUtils.responseSuccess();
    }

    @Operation(summary = "전체 조회")
    @GetMapping("/find-all")
    public CommonResponse<List<RestOutLogRes.Item>> findAll(@ModelAttribute RestOutLogReq.Filter filter) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.findAll(filter));
    }

    @Operation(summary = "아이디 선택 조회")
    @GetMapping("/find-by-ids")
    public CommonResponse<List<RestOutLogRes.Item>> findByIds(@RequestParam List<Long> ids) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.findByIds(ids));
    }

    @Operation(summary = "이름 검색")
    @GetMapping("/search-name")
    public CommonResponse<Page<RestOutLogRes.Name>> searchName(@ModelAttribute RestOutLogReq.Filter filter, Pageable pageable) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.searchName(filter, pageable));
    }

    @Operation(summary = "이름 전체 조회")
    @GetMapping("/find-all-name")
    public CommonResponse<List<RestOutLogRes.Name>> findAllName(@ModelAttribute RestOutLogReq.Filter filter) {
        return CommonResponseUtils.responseSuccess(restOutLogFacade.findAllName(filter));
    }

    @Operation(summary = "아이디 선택 삭제")
    @DeleteMapping("/delete-by-ids")
    public CommonResponse<?> deleteByIds(@RequestParam List<Long> ids) {
        restOutLogFacade.deleteByIds(ids);
        return CommonResponseUtils.responseSuccess();
    }
}
```

