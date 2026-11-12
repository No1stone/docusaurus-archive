package com.example.template.support;

import org.springframework.http.HttpStatus;

/**
 * 시스템 공통 응답 코드만 둡니다.
 * API 모듈 전용 코드는 각 모듈에서 ResponseTypeInterface를 구현한 이넘으로 관리합니다.
 */
public enum ResponseType implements ResponseTypeInterface {

    SUCCESS(HttpStatus.OK, "CM0000", "정상 처리되었습니다."),

    BAD_REQUEST(HttpStatus.BAD_REQUEST, "CM0001", "잘못된 요청입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "CM0002", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "CM0003", "권한이 없습니다."),
    NOT_FOUND_RESOURCE(HttpStatus.NOT_FOUND, "CM0004", "요청한 리소스를 찾을 수 없습니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "CM0005", "허용되지 않은 메소드입니다."),
    BAD_GATEWAY(HttpStatus.BAD_GATEWAY, "CM0006", "서버와의 연결이 끊겼습니다."),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "CM0007", "서비스를 사용할 수 없습니다."),
    INVALID_PARAMETER(HttpStatus.BAD_REQUEST, "CM0008", "잘못된 파라미터 값입니다."),
    INVALID_DATE_FORMAT(HttpStatus.BAD_REQUEST, "CM0009", "잘못된 날짜 형식이 포함되어 있습니다."),
    INVALID_ENUM_VALUE(HttpStatus.BAD_REQUEST, "CM0010", "잘못된 열거형 값이 포함되어 있습니다."),
    UPLOAD_FILE_SIZE_EXCEEDED(HttpStatus.INTERNAL_SERVER_ERROR, "CM0011", "업로드 파일 크기가 초과되었습니다."),
    NOT_ALLOWED_ENUM_VALUE(HttpStatus.BAD_REQUEST, "CM0012", "허용되지 않는 열거형 값이 포함되어 있습니다."),
    OBJECT_LOCKED(HttpStatus.INTERNAL_SERVER_ERROR, "CM0013", "객체가 잠겨있습니다."),
    MICRO_SERVICE_CONNECTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "CM0014", "마이크로 서비스 연결에 실패하였습니다."),

    UNDEFINED(HttpStatus.INTERNAL_SERVER_ERROR, "CM9998", "정의되지 않은 오류가 발생하였습니다."),
    UNKNOWN(HttpStatus.INTERNAL_SERVER_ERROR, "CM9999", "알 수 없는 오류가 발생하였습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String desc;

    ResponseType(HttpStatus httpStatus, String code, String desc) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.desc = desc;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getDesc() {
        return desc;
    }

    @Override
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public static ResponseType of(String code) {
        for (ResponseType responseType : values()) {
            if (responseType.getCode().equals(code)) {
                return responseType;
            }
        }
        return UNKNOWN;
    }
}
