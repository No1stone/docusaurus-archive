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
