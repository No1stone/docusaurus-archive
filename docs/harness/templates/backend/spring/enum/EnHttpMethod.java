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
