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
