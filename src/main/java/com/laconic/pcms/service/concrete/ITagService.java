package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.TagRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TagResponse;

import java.util.List;

public interface ITagService {
    void save(TagRequest request);
    void update(TagRequest request, Long id);
    TagResponse getById(Long id);
    PaginationResponse<TagResponse> getAll(int pageNo, int pageSize, String keyword);
    List<TagResponse> getAll();

    void delete(Long id);
}
