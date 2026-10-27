package com.example.template.support;

import jakarta.persistence.PrePersist;

import java.util.UUID;

/**
 * {@link BaseEntity}에 함께 등록하는 영속 훅입니다.
 * {@code ServiceProviderble} / {@code IdGeneratable}을 구현한 엔티티만 채웁니다.
 * 서비스 id는 호스트의 {@code WebUtils.getServiceId()} 등으로 채웁니다.
 */
public class BaseEntityListener {

    @PrePersist
    public void prePersist(Object o) {
        if (o instanceof ServiceProviderble) {
            // Host: ((ServiceProviderble) o).setServiceId(WebUtils.getServiceId());
        }

        if (o instanceof IdGeneratable obj) {
            obj.setId(UuidUtils.uuidToBase64(UUID.randomUUID()));
        }
    }
}
