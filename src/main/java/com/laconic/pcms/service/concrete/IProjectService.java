package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.ChangeManagerRequest;
import com.laconic.pcms.request.ProjectRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.ProjectResponse;

import java.util.List;

public interface IProjectService {
    void save(ProjectRequest request);
    void update(ProjectRequest request, Long id);
    ProjectResponse getById(Long id);
    PaginationResponse<ProjectResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);
    List<ProjectResponse> getAll();
    void delete(Long id);

    void changeStage(Long projectId, Long stageId);

    void removeTask(Long projectId, Long taskId);
    void changeManager(ChangeManagerRequest request);
    void changeVisibility(Long id, Boolean isPrivate);
    void enable(Long id);

    ProjectResponse duplicate(Long id);
}
