package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.UpdateRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.UpdateResponse;

import java.util.List;

public interface IUpdateService {
    void save(UpdateRequest request);
    void update(UpdateRequest request, Long id);
    UpdateResponse getById(Long id);
    PaginationResponse<UpdateResponse> getAll(int pageNo, int pageSize, String keyword);
    PaginationResponse<UpdateResponse> getAllByProject(int pageNo, int pageSize, Long projectId);
    List<UpdateResponse> getAll();

    void delete(Long id);
}

