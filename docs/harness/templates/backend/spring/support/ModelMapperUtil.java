package com.example.template.support;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.config.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.util.CollectionUtils;

import javax.print.attribute.standard.Destination;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static org.modelmapper.convention.MatchingStrategies.STRICT;

public class ModelMapperUtil {
    protected final Logger log = LoggerFactory.getLogger(getClass());

    public static ModelMapper modelMapper = new ModelMapper();

    static {
        modelMapper.getConfiguration()
                .setMatchingStrategy(STRICT)
                .setFieldAccessLevel(Configuration.AccessLevel.PRIVATE)
                .setSkipNullEnabled(true)
                .setFieldMatchingEnabled(true);
    }

    public static <D> D map(Object source, Class<D> destinationType) {
        if (source == null) return null;
        return modelMapper.map(source, destinationType);
    }

    //    public static <D> D map(Object source, Class<D> destinationType, String typeMapName) {
//        if(source == null) return null;
//        return modelMapper.map(source, destinationType, typeMapName);
//    }
//
    public static void map(Object source, Object destination) {
        modelMapper.map(source, destination);
    }

//    public static void map(Object source, Object destination, String typeMapName) {
//        modelMapper.map(source, destination, typeMapName);
//    }

//    public static <D> D map(Object source, Type destinationType) {
//        return modelMapper.map(source, destinationType);
//    }

//    public static <D> D map(Object source, Type destinationType, String typeMapName) {
//        return modelMapper.map(source, destinationType, typeMapName);
//    }

    public static <D, T> List<D> mapAll(Collection<T> sourceList, Class<D> destinationType) {
        if (CollectionUtils.isEmpty(sourceList))
            return List.of();
        return sourceList.stream()
                .map(source -> map(source, destinationType))
                .collect(Collectors.toList());
    }

//    public static void apply(Collection<?> sourceList, Class<?> destinationType) {
//        if (CollectionUtils.isEmpty(sourceList)) return;
//        ApplyHolder.addApply();
//        sourceList.forEach(source -> {
//            if (destinationType.isAssignableFrom(source.getClass())) {
//
//            }
//        });
//    }

    public static <D, T> Page<D> mapAll(Page<T> page, Class<D> destinationType) {
        return page.map(e -> map(e, destinationType));
    }


}
