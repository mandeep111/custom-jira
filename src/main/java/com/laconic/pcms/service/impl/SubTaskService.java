package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.DuplicateComponent;
import com.laconic.pcms.entity.SubTask;
import com.laconic.pcms.entity.Task;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.enums.TaskPriority;
import com.laconic.pcms.event.SubTaskEvent;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.ISubTaskRepo;
import com.laconic.pcms.repository.ITaskRepo;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.SubTaskRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SubTaskResponse;
import com.laconic.pcms.service.concrete.ISubTaskService;
import com.laconic.pcms.component.WorkflowComponent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class SubTaskService implements ISubTaskService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public static final String USER_NOT_PRESENT = "User is not present in this %s";
    @Value("${workflow.ui.url}")
    private String BASE_UI_URL;
    private final ISubTaskRepo subTaskRepo;
    private final CommonComponent commonComponent;
    private final WorkflowComponent workflowComponent;
    private final DuplicateComponent duplicateComponent;
    private final IUserRepo userRepo;

    private final ITaskRepo taskRepo;


    public SubTaskService(ISubTaskRepo subTaskRepo, CommonComponent commonComponent, WorkflowComponent workflowComponent, DuplicateComponent duplicateComponent, IUserRepo userRepo, ITaskRepo taskRepo) {
        this.subTaskRepo = subTaskRepo;
        this.commonComponent = commonComponent;
        this.workflowComponent = workflowComponent;
        this.duplicateComponent = duplicateComponent;
        this.userRepo = userRepo;
        this.taskRepo = taskRepo;
    }

    @Override
    @Transactional
    public SubTaskResponse save(SubTaskRequest request) {
        SubTask entity = convertObject(request, SubTask.class);
        var assignee = this.commonComponent.getEntity(request.getUserId(), User.class, USER);
        var task = this.commonComponent.getEntity(request.getTaskId(), Task.class, TASK);
        // validate user is present in task or not
        checkAssignee(task, assignee);
        entity.setStatus(ProgressStatus.WAITING);
        entity.setTask(task);
        entity.setUser(assignee);
        if (request.getNeedApproval()) {
            if (request.getFormId() == null) throw new PreconditionFailedException("Workflow approval need form id");
            entity.setUrl(BASE_UI_URL + "/" + request.getFormId());
        }
        var subTask = this.subTaskRepo.saveAndFlush(entity);
        // publish event to update task and project
        eventPublisher.publishEvent(new SubTaskEvent(subTask));
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
            subTask.setUrl(BASE_UI_URL + request.getFormId());
        }
        this.subTaskRepo.save(subTask);
    }

    @Override
    public PaginationResponse<SubTaskResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<SubTask> page;
        if (keyword != null) {
            var specs = CommonComponent.getSpecification(SubTask.class, SUB_TASK, keyword, searchAttributes);
//            page = this.subTaskRepo.findAll(specs, pageable);
            page = this.subTaskRepo.findAllBy(specs, pageable);
        } else page = this.subTaskRepo.findAll(pageable);
        return getPaginationResponse(page, SubTaskResponse.class);
    }

    @Override
    public List<SubTaskResponse> getAll() {
        var result = this.subTaskRepo.findAll();
        return convertList(result, SubTaskResponse.class);
    }

    @Override
    public List<SubTaskResponse> getAllBySpace(Long id, Date startDate, Date endDate) {
        List<SubTask> subTasks;
        if (id != null) {
            subTasks = this.subTaskRepo.findAllBySpaceId(id, startDate, endDate);
        } else {
            subTasks = this.subTaskRepo.findAllByAssignedDateBetween(startDate, endDate);
        }
        var response = convertList(subTasks, SubTaskResponse.class);
        response.forEach(subTaskResponse -> {
            subTasks.stream()
                    .filter(subTask -> subTaskResponse.getId().equals(subTask.getId()))
                    .findFirst()
                    .ifPresent(subTask -> {
                        // Set projectId and spaceId based on subTask
                        subTaskResponse.setProjectId(subTask.getTask().getProject().getId());
                        subTaskResponse.setProjectName(subTask.getTask().getProject().getName());
                        subTaskResponse.setSpaceId(subTask.getTask().getProject().getSpace().getId());
                        subTaskResponse.setSpaceName(subTask.getTask().getProject().getSpace().getName());
                    });
        });
        return response;

    }

    @Override
    public SubTaskResponse getById(Jwt jwt, Long id) {
        var result = getSubTask(id);
        var project = result.getTask().getProject();
        var response = convertObject(result, SubTaskResponse.class);
        response.setProjectId(project.getId());
        response.setProjectName(project.getName());
        if (response.getRequestCode() != null && response.getNeedApproval()) {
            response.setStatus(workflowComponent.checkStatus(response.getRequestCode(), jwt.getTokenValue()) ? ProgressStatus.COMPLETED : ProgressStatus.WAITING);
        }
        return response;
    }

    @Override
    @Transactional
    public void changeStatus(Long id, ProgressStatus status) {
        var subTask = getSubTask(id);
        subTask.setStatus(status);
        subTask = this.subTaskRepo.saveAndFlush(subTask);
        eventPublisher.publishEvent(new SubTaskEvent(subTask));
       /* var _task = subTask.getTask();
        var response = TaskUtil.mapProgress(convertObject(_task, TaskResponse.class));
        _task.setProgress(response.getProgress());
        this.taskRepo.save(_task);*/
    }

    @Override
    public void disable(Long id) {
        var subTask = getSubTask(id);
        subTask.setActive(false);
        subTask = this.subTaskRepo.save(subTask);
        eventPublisher.publishEvent(new SubTaskEvent(subTask));
    }

    @Override
    public void changeAssignee(Long id, Long userId) {
        var subTask = getSubTask(id);
        Long taskId = subTask.getTask().getId();
        var user = this.userRepo.findByIdAndTasks_Id(userId, taskId).orElseThrow(throwNotFoundException(userId, taskId, TASK, USER));
        checkAssignee(subTask.getTask(), user);
        subTask.setUser(user);
        this.subTaskRepo.save(subTask);
    }

    private static void checkAssignee(Task task, User user) {
        // validate user is present in task or not
        if (task.getUsers().stream().noneMatch(a -> a.getId().equals(user.getId()))) {
            throw new PreconditionFailedException(String.format(USER_NOT_PRESENT, "task"));
        }
    }

    @Override
    public SubTaskResponse duplicate(Long id) {
        var duplicateSubTask = duplicateComponent.duplicateSubTaskWithTask(id);
        var response = convertObject(duplicateSubTask, SubTaskResponse.class);
        var project = duplicateSubTask.getTask().getProject();
        response.setProjectId(project.getId());
        response.setProjectName(project.getName());
        eventPublisher.publishEvent(new SubTaskEvent(duplicateSubTask));
        return response;
    }

    @Override
    public SubTaskResponse changePriority(Long id, TaskPriority priority) {
        var subTask = getSubTask(id);
        subTask.setPriority(priority);
        subTask = this.subTaskRepo.saveAndFlush(subTask);
        return convertObject(subTask, SubTaskResponse.class);
    }

    public SubTask getSubTask(Long id) {
        return this.subTaskRepo.findById(id).orElseThrow(throwNotFoundException(id, SUB_TASK));
    }
}
