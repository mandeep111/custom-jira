package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.MileStoneRequest;
import com.laconic.pcms.response.MileStoneResponse;
import com.laconic.pcms.response.PaginationResponse;

import java.util.List;

public interface IMilestoneService {
    void save(MileStoneRequest request);
    void update(MileStoneRequest request);
    MileStoneResponse getById(Long id);
    PaginationResponse<MileStoneResponse> getAll(int pageNo, int pageSize, String keyword);
    List<MileStoneResponse> getAll();

    void delete(Long id);
}
