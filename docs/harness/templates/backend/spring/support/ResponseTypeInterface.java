package com.example.template.support;

import org.springframework.http.HttpStatus;

public interface ResponseTypeInterface {
    String getCode();

    String getDesc();

    HttpStatus getHttpStatus();
}
