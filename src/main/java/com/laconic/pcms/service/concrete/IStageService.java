package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.StageRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.StageResponse;

import java.util.List;

public interface IStageService {
    void save(StageRequest request);
    void update(StageRequest request, Long id);
    StageResponse getById(Long id);
    PaginationResponse<StageResponse> getAll(int pageNo, int pageSize, String keyword);
    List<StageResponse> getAll();

    void delete(Long id);
}
