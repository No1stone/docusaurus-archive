package com.example.template.support;

import jakarta.persistence.AttributeConverter;
import lombok.extern.slf4j.Slf4j;

import java.util.EnumSet;

@Slf4j
public abstract class CodeValueConverter<E extends Enum<E> & CodeValue> implements AttributeConverter<E, String> {

    abstract protected Class<E> support();

    @Override
    public String convertToDatabaseColumn(E attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public E convertToEntityAttribute(String dbData) {
        log.debug("dbData: {}", dbData, "class: {}", support());
        if (dbData == null) {
            return null;
        }
        return EnumSet.allOf(support()).stream()
                .filter(e -> e.getCode().equals(dbData))
                .findAny()
                .orElseThrow(() -> new BizErrorException(ResponseType.INVALID_ENUM_VALUE).addData("code", dbData));
    }
}
