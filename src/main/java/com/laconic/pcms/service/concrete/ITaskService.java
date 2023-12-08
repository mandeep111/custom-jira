package com.laconic.pcms.service.concrete;

import com.laconic.pcms.enums.TaskPriority;
import com.laconic.pcms.request.GroupByRequest;
import com.laconic.pcms.request.TaskRequest;
import com.laconic.pcms.response.GroupByResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TaskResponse;

import java.util.List;

public interface ITaskService {
    void save(TaskRequest request);

    void update(TaskRequest request, Long id);

    TaskResponse getById(Long id);

    PaginationResponse<TaskResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes, Long projectId, String email);

    List<TaskResponse> getAll(String email);

    void delete(Long id);

    void changeStatus(Long id, Long taskTypeId);

    TaskResponse addTag(Long taskId, Long tagId);

    TaskResponse removeTag(Long taskId, Long tagId);

    List<TaskResponse> getTaskByProject(Long project, String email);

    void enable(Long id);

    TaskResponse addAssignee(Long taskId, Long userId);

    TaskResponse removeAssignee(Long taskId, Long userId);

    TaskResponse duplicateTask(Long taskId);

    TaskResponse changePriority(Long id, TaskPriority priority);
    List<GroupByResponse> getGroupedTasks(String email, GroupByRequest request);

    TaskResponse resolveSubTasks(Long taskId);
}
