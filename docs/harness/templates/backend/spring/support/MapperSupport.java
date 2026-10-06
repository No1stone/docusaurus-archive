package com.example.template.support;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.data.domain.Page;

import java.beans.PropertyDescriptor;
import java.util.List;

/** Stand-in for host ModelMapperUtil / BeanUtils. Prefer host utilities in real apps. */
public final class MapperSupport {
    private MapperSupport() {}

    public static <S, T> T map(S source, Class<T> targetType) {
        if (source == null) {
            return null;
        }
        try {
            T target = targetType.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(source, target);
            return target;
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
    }

    public static <S, T> List<T> mapAll(List<S> source, Class<T> targetType) {
        return source.stream().map(s -> map(s, targetType)).toList();
    }

    public static <S, T> Page<T> mapAll(Page<S> source, Class<T> targetType) {
        return source.map(s -> map(s, targetType));
    }

    /** Partial update: copy non-null properties only. */
    public static void copyNonNull(Object source, Object target) {
        BeanWrapper src = new BeanWrapperImpl(source);
        BeanWrapper trg = new BeanWrapperImpl(target);
        for (PropertyDescriptor pd : src.getPropertyDescriptors()) {
            String name = pd.getName();
            if ("class".equals(name) || !trg.isWritableProperty(name)) {
                continue;
            }
            Object value = src.getPropertyValue(name);
            if (value != null) {
                trg.setPropertyValue(name, value);
            }
        }
    }
}
