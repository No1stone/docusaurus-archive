package com.example.template.support;

import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

public class BizException extends RuntimeException {

    private final SystemServiceModule systemServiceModule;
    private final HttpStatus httpStatus;
    private final ResponseTypeInterface responseType;
    private final String errorMessage;
    private Map<String, Object> data;

    protected BizException(ResponseTypeInterface responseType) {
        this(SystemServiceModule.DEFAULT, responseType);
    }

    protected BizException(ResponseTypeInterface responseType, Object... args) {
        this(SystemServiceModule.DEFAULT, responseType, args);
    }

    protected BizException(ResponseTypeInterface responseType, Throwable cause) {
        this(SystemServiceModule.DEFAULT, responseType, cause);
    }

    protected BizException(ResponseTypeInterface responseType, Throwable cause, Object... args) {
        this(SystemServiceModule.DEFAULT, responseType, cause, args);
    }

    protected BizException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType) {
        super(responseType.getDesc());
        this.systemServiceModule = systemServiceModule;
        this.httpStatus = responseType.getHttpStatus();
        this.responseType = responseType;
        this.errorMessage = responseType.getDesc();
    }

    protected BizException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Object... args) {
        super(format(responseType.getDesc(), args));
        this.systemServiceModule = systemServiceModule;
        this.httpStatus = responseType.getHttpStatus();
        this.responseType = responseType;
        this.errorMessage = format(responseType.getDesc(), args);
    }

    protected BizException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Throwable cause) {
        super(responseType.getDesc(), cause);
        this.systemServiceModule = systemServiceModule;
        this.httpStatus = responseType.getHttpStatus();
        this.responseType = responseType;
        this.errorMessage = responseType.getDesc();
    }

    protected BizException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Throwable cause, Object... args) {
        super(format(responseType.getDesc(), args), cause);
        this.systemServiceModule = systemServiceModule;
        this.httpStatus = responseType.getHttpStatus();
        this.responseType = responseType;
        this.errorMessage = format(responseType.getDesc(), args);
    }

    public SystemServiceModule getSystemServiceModule() {
        return systemServiceModule;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public ResponseTypeInterface getResponseType() {
        return responseType;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public BizException addData(String key, Object value) {
        if (data == null) {
            data = new HashMap<>();
        }
        data.put(key, value);
        return this;
    }

    private static String format(String template, Object... args) {
        if (args == null || args.length == 0) {
            return template;
        }
        return String.format(template.replace("{}", "%s"), args);
    }
}
