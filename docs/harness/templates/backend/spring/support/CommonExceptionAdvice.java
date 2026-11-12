package com.example.template.support;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CommonExceptionAdvice {

    @ExceptionHandler(BizWarnException.class)
    public CommonResponse<?> handleBizWarn(BizWarnException e, HttpServletResponse response) {
        response.setStatus(e.getHttpStatus().value());
        return CommonResponseUtils.response(e.getSystemServiceModule(), e.getResponseType(), e.getErrorMessage());
    }

    @ExceptionHandler(BizErrorException.class)
    public CommonResponse<?> handleBizError(BizErrorException e, HttpServletResponse response) {
        response.setStatus(e.getHttpStatus().value());
        return CommonResponseUtils.response(e.getSystemServiceModule(), e.getResponseType(), e.getErrorMessage(), e.getData());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponse<?> handleValidation(MethodArgumentNotValidException e) {
        return CommonResponseUtils.response(ResponseType.INVALID_PARAMETER);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CommonResponse<?> handleException(Exception e, HttpServletRequest request) {
        return CommonResponseUtils.response(ResponseType.UNKNOWN);
    }
}
