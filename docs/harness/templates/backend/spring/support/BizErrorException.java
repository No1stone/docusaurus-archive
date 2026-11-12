package com.example.template.support;

public class BizErrorException extends BizException {

    public BizErrorException(ResponseTypeInterface responseType) {
        super(responseType);
    }

    public BizErrorException(ResponseTypeInterface responseType, Object... args) {
        super(responseType, args);
    }

    public BizErrorException(ResponseTypeInterface responseType, Throwable cause) {
        super(responseType, cause);
    }

    public BizErrorException(ResponseTypeInterface responseType, Throwable cause, Object... args) {
        super(responseType, cause, args);
    }

    public BizErrorException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType) {
        super(systemServiceModule, responseType);
    }

    public BizErrorException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Throwable cause) {
        super(systemServiceModule, responseType, cause);
    }

    public BizErrorException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Object... args) {
        super(systemServiceModule, responseType, args);
    }

    public BizErrorException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Throwable cause, Object... args) {
        super(systemServiceModule, responseType, cause, args);
    }
}
