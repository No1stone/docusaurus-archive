package com.example.template.restoutlog.entity;

import com.example.template.restoutlog.enums.EnHttpMethod;
import com.example.template.support.CreatedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;
import org.hibernate.annotations.DynamicInsert;

import static lombok.AccessLevel.PROTECTED;

/**
 * REST outbound 호출 로그. {@code createdAt}/{@code createdBy}는 {@link CreatedEntity} 상속.
 *
 * @see db/init/01_init.sql
 */
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
@Getter
@Setter
@Entity
@FieldNameConstants
@Table(name = "le_rest_out_log", indexes = {
        @Index(name = "ix_le_rest_out_log_response_http_status", columnList = "response_http_status"),
        @Index(name = "ix_le_rest_out_log_url", columnList = "url")
})
@DynamicInsert
public class RestOutLog extends CreatedEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "http_method", nullable = false, length = 10)
    private EnHttpMethod httpMethod;

    @Column(name = "url", nullable = false, length = 255)
    private String url;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "parameter")
    private String parameter;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "payload")
    private String payload;

    @Column(name = "response_http_status", nullable = false, length = 3)
    private String responseHttpStatus;

    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    @Column(name = "response")
    private String response;

    public void delete() {
    }
}
