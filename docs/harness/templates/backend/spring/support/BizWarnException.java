package com.example.template.support;

public class BizWarnException extends BizException {

    public BizWarnException(ResponseTypeInterface responseType) {
        super(responseType);
    }

    public BizWarnException(ResponseTypeInterface responseType, Object... args) {
        super(responseType, args);
    }

    public BizWarnException(ResponseTypeInterface responseType, Throwable cause) {
        super(responseType, cause);
    }

    public BizWarnException(ResponseTypeInterface responseType, Throwable cause, Object... args) {
        super(responseType, cause, args);
    }

    public BizWarnException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType) {
        super(systemServiceModule, responseType);
    }

    public BizWarnException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Throwable cause) {
        super(systemServiceModule, responseType, cause);
    }

    public BizWarnException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Object... args) {
        super(systemServiceModule, responseType, args);
    }

    public BizWarnException(SystemServiceModule systemServiceModule, ResponseTypeInterface responseType, Throwable cause, Object... args) {
        super(systemServiceModule, responseType, cause, args);
    }
}
