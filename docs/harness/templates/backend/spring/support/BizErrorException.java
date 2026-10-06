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
