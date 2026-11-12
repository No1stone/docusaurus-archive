package com.example.template.support;

/**
 * 공통 응답 코드에 붙는 서비스 접두입니다.
 * 모듈 전용 이넘은 보통 코드에 접두를 이미 넣으므로 DEFAULT만으로도 충분합니다.
 */
public enum SystemServiceModule {
    DEFAULT("0000");

    private final String prefix;

    SystemServiceModule(String prefix) {
        this.prefix = prefix;
    }

    public String getPrefix() {
        return prefix;
    }
}
