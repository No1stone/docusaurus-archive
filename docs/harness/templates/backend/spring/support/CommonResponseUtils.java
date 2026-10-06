package com.example.template.support;

public final class CommonResponseUtils {
    private CommonResponseUtils() {}

    public static <T> CommonResponse<T> responseSuccess(T data) {
        return CommonResponse.ok(data);
    }

    public static CommonResponse<Void> responseSuccess() {
        return CommonResponse.ok();
    }
}
