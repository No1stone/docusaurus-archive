package com.example.template.support;

public final class CommonResponseUtils {
    private CommonResponseUtils() {}

    public static <T> CommonResponse<T> responseSuccess(T data) {
        return response(SystemServiceModule.DEFAULT, ResponseType.SUCCESS, ResponseType.SUCCESS.getDesc(), data);
    }

    public static CommonResponse<Void> responseSuccess() {
        return response(SystemServiceModule.DEFAULT, ResponseType.SUCCESS, ResponseType.SUCCESS.getDesc(), null);
    }

    public static <T> CommonResponse<T> response(ResponseTypeInterface responseType) {
        return response(SystemServiceModule.DEFAULT, responseType, responseType.getDesc(), null);
    }

    public static <T> CommonResponse<T> response(ResponseTypeInterface responseType, String message) {
        return response(SystemServiceModule.DEFAULT, responseType, message, null);
    }

    public static <T> CommonResponse<T> response(SystemServiceModule module, ResponseTypeInterface responseType, T data) {
        return response(module, responseType, responseType.getDesc(), data);
    }

    public static <T> CommonResponse<T> response(
            SystemServiceModule module,
            ResponseTypeInterface responseType,
            String message
    ) {
        return response(module, responseType, message, null);
    }

    public static <T> CommonResponse<T> response(
            SystemServiceModule module,
            ResponseTypeInterface responseType,
            String message,
            T data
    ) {
        String code = responseType.getCode();
        if (responseType.getClass() == ResponseType.class) {
            code = module.getPrefix() + responseType.getCode();
        }
        return new CommonResponse<>(code, message, data);
    }
}
