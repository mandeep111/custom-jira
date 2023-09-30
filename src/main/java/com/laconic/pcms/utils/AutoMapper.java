package com.laconic.pcms.utils;


import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;

public class AutoMapper {

    private final ModelMapper modelMapper;

    public AutoMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public static <S, T> T convertObject(S source, Class<T> targetClass) {
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(source, targetClass);
    }

    public static <T, U> List<U> convertList(List<T> entityList, Class<U> dtoClass) {
        List<U> dtoList = new ArrayList<>();
        for (T entity : entityList) {
            U dto = convertObject(entity, dtoClass);
            dtoList.add(dto);
        }
        return dtoList;
    }
}
