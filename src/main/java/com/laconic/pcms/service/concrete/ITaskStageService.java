package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.TaskTypeRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TaskStageResponse;

import java.util.List;

public interface ITaskStageService {
    void save(TaskTypeRequest request);
    void update(TaskTypeRequest request, Long id);
    TaskStageResponse getById(Long id);
    PaginationResponse<TaskStageResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);
    List<TaskStageResponse> getAll();

    void delete(Long id);
}
