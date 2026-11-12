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

    public CommonResponse(ResponseTypeInterface type, String message, T data) {
        this.code = type.getCode();
        this.message = message;
        this.data = data;
    }

    public static <T> CommonResponse<T> ok(T data) {
        return new CommonResponse<>(ResponseType.SUCCESS, ResponseType.SUCCESS.getDesc(), data);
    }

    public static CommonResponse<Void> ok() {
        return new CommonResponse<>(ResponseType.SUCCESS, ResponseType.SUCCESS.getDesc(), null);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
