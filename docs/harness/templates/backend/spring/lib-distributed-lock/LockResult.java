package com.example.template.lock;

/**
 * 분산 락 시도 결과. 획득 여부와 콜백 반환값을 분리한다.
 * {@code acquired == false}이면 {@code value}는 의미 없다(항상 null).
 * {@code acquired == true}이면 {@code value}는 null일 수 있다.
 */
public record LockResult<T>(boolean acquired, T value) {

    public static <T> LockResult<T> missed() {
        return new LockResult<>(false, null);
    }

    public static <T> LockResult<T> hit(T value) {
        return new LockResult<>(true, value);
    }
}
