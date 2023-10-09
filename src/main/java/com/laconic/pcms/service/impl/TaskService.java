package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.DuplicateComponent;
import com.laconic.pcms.entity.*;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.repository.*;
import com.laconic.pcms.request.IdRequest;
import com.laconic.pcms.request.TaskRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.service.concrete.ITaskService;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class TaskService implements ITaskService {
    private final ITaskRepo taskRepo;
    private final CommonComponent commonComponent;
    private final ITagRepo projectTagRepo;
    private final IUserRepo userRepo;
    private final DuplicateComponent duplicateComponent;

    public TaskService(ITaskRepo taskRepo, CommonComponent commonComponent, ITagRepo projectTagRepo, IUserRepo userRepo, DuplicateComponent duplicateComponent) {
        this.taskRepo = taskRepo;
        this.commonComponent = commonComponent;
        this.projectTagRepo = projectTagRepo;
        this.userRepo = userRepo;
        this.duplicateComponent = duplicateComponent;
    }

    /**
     * @param request
     */
    @Override
    public void save(TaskRequest request) {
        var projectTask = convertObject(request, Task.class);
        var project = commonComponent.getEntity(request.getProjectId(), Project.class, PROJECT);
//        var company =commonComponent.getEntity(request.getCompanyId(), Company.class, COMPANY);
        var taskStage = commonComponent.getEntity(request.getTaskStageId(), TaskStage.class, TASK_TYPE);
        if (request.getMilestoneId() != null) {
            var milestone = commonComponent.getEntity(request.getMilestoneId(), Milestone.class, MILESTONE);
            projectTask.setMilestone(milestone);
        }
//        project.setCompany(company);
        projectTask.setProject(project);
        projectTask.setTaskStage(taskStage);

        // Fetch the project tags and assignee by their IDs
        var projectTags = projectTagRepo.findAllById(request.getTags().stream().map(IdRequest::id).toList());
        var assignee = userRepo.findAllById(request.getAssignee().stream().map(IdRequest::id).toList());

        // Set the project tags for the project
        projectTask.setTags(projectTags);
        projectTask.setAssignees(assignee);
        this.taskRepo.save(projectTask);
    }

    @Override
    public void update(TaskRequest request, Long id) {
        var task = getTask(id);
        task.setColor(request.getColor());
        task.setName(request.getName());
        task.setPriority(request.getPriority());
        task.setDeadlineDate(request.getDeadlineDate());
        task.setAssignedDate(request.getAssignedDate());
        task.setIsClosed(request.getIsClosed());
        task.setIsBlocked(request.getIsBlocked());
//        task.setProgress(request.getProgress());
        this.taskRepo.save(task);
    }

    @Override
    public TaskResponse getById(Long id) {
        var result = convertObject(getTask(id), TaskResponse.class);
        // set progress
        return mapProgress(result);
    }

    private Task getTask(Long id) {
        return taskRepo.findById(id).orElseThrow(throwNotFoundException(id, TASK));
    }

    @Override
    public PaginationResponse<TaskResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var page = commonComponent.findAllEntities(Task.class, TASK, keyword, searchAttributes, pageable);
        var response = convertList(page.getContent(), TaskResponse.class);
        response = response.stream().map(TaskService::mapProgress).toList();
        return new PaginationResponse<>(response, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public List<TaskResponse> getAll() {
        var result = this.taskRepo.findAll();
        var response = convertList(result, TaskResponse.class);
        return response.stream().map(TaskService::mapProgress).toList();
    }

    @Override
    public void delete(Long id) {
        var result = getTask(id);
        result.setActive(false);
        this.taskRepo.save(result);
    }

    @Override
    public void changeStatus(Long id, Long taskTypeId) {
        var projectTask = getTask(id);
        var taskType = commonComponent.getEntity(taskTypeId, TaskStage.class, TASK_TYPE);
        projectTask.setTaskStage(taskType);
        this.taskRepo.save(projectTask);
    }

    @Override
    @Transactional
    @Modifying
    public TaskResponse addTag(Long taskId, Long tagId) {
        var task = getTask(taskId);
        var tag = commonComponent.getEntity(tagId, Tag.class, TAG);
        List<Tag> tags = new ArrayList<>(task.getTags());
        tags.add(tag);
        task.setTags(tags);
        task = this.taskRepo.save(task);
        return convertObject(task, TaskResponse.class);
    }

    @Override
    @Transactional
    @Modifying
    public TaskResponse removeTag(Long taskId, Long tagId) {
        var task = getTask(taskId);
        var tag = commonComponent.getEntity(tagId, Tag.class, TAG);
        List<Tag> tags = new ArrayList<>(task.getTags());
        tags.remove(tag);
        task.setTags(tags);
        task = this.taskRepo.save(task);
        return convertObject(task, TaskResponse.class);

    }

    @Override
    public void enable(Long id) {
        var task = getTask(id);
        task.setActive(true);
        this.taskRepo.save(task);
    }

    @Override
    @Transactional
    @Modifying
    public TaskResponse addAssignee(Long taskId, Long userId) {
        var task = getTask(taskId);
        var user = commonComponent.getEntity(userId, User.class, USER);
        List<User> users = new ArrayList<>(task.getAssignees());
        users.add(user);
        task.setAssignees(users);
        task = this.taskRepo.save(task);
        return convertObject(task, TaskResponse.class);
    }

    @Override
    @Transactional
    @Modifying
    public TaskResponse removeAssignee(Long taskId, Long userId) {
        var task = getTask(taskId);
        var user = commonComponent.getEntity(userId, User.class, USER);
        List<User> users = new ArrayList<>(task.getAssignees());
        users.remove(user);
        task.setAssignees(users);
        task = this.taskRepo.save(task);
        return convertObject(task, TaskResponse.class);
    }

    @Override
    public TaskResponse duplicateTask(Long taskId) {
        var task = duplicateComponent.duplicateTask(taskId);
        return convertObject(task, TaskResponse.class);
    }

    public static TaskResponse mapProgress(TaskResponse result) {
        if (result.getSubTasks().size() > 0) {
            long completed = result.getSubTasks().stream().filter(st -> st.getProgressStatus().equals(ProgressStatus.COMPLETED)).count();
            System.out.println(completed);
            long total = result.getSubTasks().size();
            System.out.println(total);

            // Cast either completed or total to double for floating-point division
            double progress = ((double) completed / total) * 100;
            System.out.println(progress);
            result.setProgress(progress); // calculate progress percentage
        }
        return result;
    }

    public static Set<TaskResponse> mapProgress(Set<TaskResponse> result) {
        Set<TaskResponse> responses = new HashSet<>();
        result.forEach(r -> responses.add(mapProgress(r)));
        return responses;
    }
}