package com.laconic.pcms.service.concrete;

import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.enums.TaskPriority;
import com.laconic.pcms.request.SubTaskRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SubTaskResponse;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Date;
import java.util.List;

public interface ISubTaskService {
    SubTaskResponse save(SubTaskRequest request);
    void update(SubTaskRequest request, Long id);
    PaginationResponse<SubTaskResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);
    List<SubTaskResponse> getAll();
    List<SubTaskResponse> getAllBySpace(Long id, Date startDate, Date endDate);
    SubTaskResponse getById(Jwt jwt, Long id);

    void changeStatus(String email, Long id, ProgressStatus status);
    void disable(Long id);
    SubTaskResponse changeAssignee(Long id, Long userId);
    SubTaskResponse duplicate(Long id);
    void delete(Long id);
    SubTaskResponse changePriority(Long id, TaskPriority priority);
}
