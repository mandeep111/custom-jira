package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.TaskStage;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.repository.ITaskStageRepo;
import com.laconic.pcms.request.TaskTypeRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TaskStageResponse;
import com.laconic.pcms.service.concrete.ITaskStageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class TaskStageService implements ITaskStageService {
    private final CommonComponent commonComponent;
    private final ITaskStageRepo taskStageRepo;

    public TaskStageService(CommonComponent commonComponent, ITaskStageRepo taskStageRepo) {
        this.commonComponent = commonComponent;
        this.taskStageRepo = taskStageRepo;
    }

    @Override
    public void save(TaskTypeRequest request) {
        var taskType = convertObject(request, TaskStage.class);
        if (request.getUserId() != null) {
            var user = commonComponent.getEntity(request.getUserId(), User.class, USER);
            taskType.setUser(user);
        }
        this.taskStageRepo.save(taskType);
    }

    @Override
    public void update(TaskTypeRequest request, Long id) {
        var taskStage = getTaskType(id);
        taskStage.setName(request.getName());
        taskStage.setDescription(request.getDescription());
        taskStage.setIsFold(request.isFold());
        taskStage.setColor(request.getColor());
        this.taskStageRepo.save(taskStage);
    }

    @Override
    public TaskStageResponse getById(Long id) {
        var result = getTaskType(id);
        return convertObject(result, TaskStageResponse.class);
    }

    private TaskStage getTaskType(Long id) {
        return taskStageRepo.findById(id).orElseThrow(throwNotFoundException(id, TASK_TYPE));
    }

    @Override
    public PaginationResponse<TaskStageResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<TaskStage> page;
        if (keyword != null) {
            var specs = CommonComponent.getSpecification(TaskStage.class, TASK_TYPE, keyword, searchAttributes);
            page = this.taskStageRepo.findAll(specs, pageable);
        } else page = this.taskStageRepo.findAll(pageable);
        return getPaginationResponse(page, TaskStageResponse.class);
    }

    @Override
    public List<TaskStageResponse> getAll() {
        var result = this.taskStageRepo.findAll();
        return convertList(result, TaskStageResponse.class);
    }

    public List<TaskStageResponse> getByProject(Long projectId) {
        Sort sort = Sort.by(Sort.Order.asc("id"));
        List<TaskStage> taskStages = taskStageRepo.findByProjectsId(projectId, sort);
        return convertList(taskStages, TaskStageResponse.class);
    }

    @Override
    public void delete(Long id) {
        var result = getTaskType(id);
        result.setActive(false);
        this.taskStageRepo.save(result);
    }
}