package com.laconic.pcms.utils;

import com.laconic.pcms.response.PaginationResponse;
import org.springframework.data.domain.Page;

import java.util.List;

import static com.laconic.pcms.utils.AutoMapper.convertList;

public abstract class CommonMapper {

    public static <S, T> PaginationResponse<S> getPaginationResponse(Page<T> page, Class<S> responseType) {
        var content =convertList(page.getContent(), responseType);
        return new PaginationResponse<>(content, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

}
