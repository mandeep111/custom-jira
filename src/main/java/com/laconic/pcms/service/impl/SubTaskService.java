package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.SubTask;
import com.laconic.pcms.entity.Task;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.ISubTaskRepo;
import com.laconic.pcms.request.SubTaskRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SubTaskResponse;
import com.laconic.pcms.service.concrete.ISubTaskService;
import com.laconic.pcms.component.WorkflowComponent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class SubTaskService implements ISubTaskService {

    @Value("${WORKFLOW_UI_URL}")
    private String BASE_UI_URL;
    private final ISubTaskRepo subTaskRepo;
    private final CommonComponent commonComponent;
    private final WorkflowComponent workflowComponent;


    public SubTaskService(ISubTaskRepo subTaskRepo, CommonComponent commonComponent, WorkflowComponent workflowComponent) {
        this.subTaskRepo = subTaskRepo;
        this.commonComponent = commonComponent;
        this.workflowComponent = workflowComponent;
    }

    @Override
    public SubTaskResponse save(SubTaskRequest request) {
        SubTask entity = convertObject(request, SubTask.class);
        var assignee = this.commonComponent.getEntity(request.getAssigneeId(), User.class, USER);
        var task = this.commonComponent.getEntity(request.getTaskId(), Task.class, TASK);
        entity.setTask(task);
        entity.setAssignee(assignee);
        if (request.getNeedApproval()) {
            if (request.getFormId() == null) throw new PreconditionFailedException("Workflow approval need form id");
            entity.setUrl(BASE_UI_URL+request.getFormId());
        }
        var subTask =  this.subTaskRepo.save(entity);
        return convertObject(subTask, SubTaskResponse.class);
    }

    @Override
    public void update(SubTaskRequest request, Long id) {
        var subTask = getSubTask(id);
        subTask.setName(request.getName());
        subTask.setDescription(request.getDescription());
        subTask.setDeadlineDate(request.getDeadlineDate());
        subTask.setAssignedDate(request.getAssignedDate());
        subTask.setType(request.getType());
        subTask.setColor(request.getColor());
        subTask.setRequestCode(request.getRequestCode());
        subTask.setNeedApproval(request.getNeedApproval());
        if (request.getNeedApproval()) {
            if (request.getFormId() == null) throw new PreconditionFailedException("Workflow approval need form id");
            subTask.setUrl(BASE_UI_URL+request.getFormId());
        }
        this.subTaskRepo.save(subTask);
    }

    @Override
    public PaginationResponse<SubTaskResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var page = commonComponent.findAllEntities(SubTask.class, SUB_TASK, keyword, searchAttributes, pageable);
        return getPaginationResponse(page, SubTaskResponse.class);
    }

    @Override
    public List<SubTaskResponse> getAll() {
        var result = this.subTaskRepo.findAll();
        return convertList(result, SubTaskResponse.class);
    }

    @Override
    public SubTaskResponse getById(Long id) {
        var result = getSubTask(id);
        var project = result.getTask().getProject();
        var response = convertObject(result, SubTaskResponse.class);
        response.setProjectId(project.getId());
        response.setProjectName(project.getName());
        if (response.getRequestCode() != null && response.getNeedApproval()) {
            response.setProgressStatus(workflowComponent.checkStatus(response.getRequestCode()) ? ProgressStatus.COMPLETED : ProgressStatus.WAITING);
        }
        return response;
    }

    @Override
    public void changeStatus(Long id, ProgressStatus status) {
        var subTask = getSubTask(id);
        subTask.setStatus(status);
        this.subTaskRepo.save(subTask);
    }

    @Override
    public void disable(Long id) {
        var subTask = getSubTask(id);
        subTask.setActive(false);
        this.subTaskRepo.save(subTask);
    }

    @Override
    public void changeAssignee(Long id, Long userId) {
        var subTask = getSubTask(id);
        var user = this.commonComponent.getEntity(userId, User.class, USER);
        subTask.setAssignee(user);
        this.subTaskRepo.save(subTask);
    }

    public SubTask getSubTask(Long id) {
        return this.subTaskRepo.findById(id).orElseThrow(throwNotFoundException(id, SUB_TASK));
    }
}
