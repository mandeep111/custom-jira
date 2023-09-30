package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.DuplicateComponent;
import com.laconic.pcms.entity.*;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.ITaskRepo;
import com.laconic.pcms.repository.ITaskStageRepo;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.ChangeManagerRequest;
import com.laconic.pcms.request.IdRequest;
import com.laconic.pcms.request.ProjectRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.service.concrete.IProjectService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class ProjectService implements IProjectService {
    private final CommonComponent commonComponent;
    private final IProjectRepo projectRepo;
    private final ITaskStageRepo taskStageRepo;
    private final ITaskRepo taskRepo;
    private final IUserRepo userRepo;
    private final DuplicateComponent duplicateComponent;

    public ProjectService(CommonComponent commonComponent, IProjectRepo projectRepo, ITaskStageRepo taskStageRepo, ITaskRepo taskRepo, IUserRepo userRepo, DuplicateComponent duplicateComponent) {
        this.commonComponent = commonComponent;
        this.projectRepo = projectRepo;
        this.taskStageRepo = taskStageRepo;
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
        this.duplicateComponent = duplicateComponent;
    }

    @Override
    public void save(ProjectRequest request) {
        var project = convertObject(request, Project.class);
    /*    if (request.getCompanyId() != null) {
            var company = commonComponent.getEntity(request.getCompanyId(), Company.class, COMPANY);
            project.setCompany(company);
        }*/
        if (request.getUserId() != null) {
            var user = commonComponent.getEntity(request.getUserId(), User.class, USER);
            project.setUser(user); // manager
        }
        var projectStage = commonComponent.getEntity(request.getStageId(), Stage.class, STAGE);
        var space = commonComponent.getEntity(request.getSpaceId(), Space.class, SPACE);
        project.setStage(projectStage);
        project.setSpace(space);

        // Fetch the task types by their IDs
        List<TaskStage> taskStages = taskStageRepo.findAllById(request.getTaskStages().stream().map(IdRequest::id).toList());

        // Set the task types for the project
        project.setTaskStages(new ArrayList<>(taskStages));
        this.projectRepo.save(project);
    }

    @Override
    public void update(ProjectRequest request, Long id) {
        var project = getProject(id);
        if (request.getUserId() != null) {
            var user = commonComponent.getEntity(request.getUserId(), User.class, USER);
            project.setUser(user); // manager
        }
        project.setDescription(request.getDescription());
        project.setColor(request.getColor());
        project.setName(request.getName());
        project.setLabel(request.getLabel());
        project.setDescription(request.getDescription());
        project.setIsPrivate(request.getIsPrivate());
        project.setIsRecurringAllowed(request.getIsRecurringAllowed());
        project.setStartDate(request.getStartDate());
        project.setDeadlineDate(request.getDeadlineDate());
        project.setAllocatedHours(request.getAllocatedHours());
        project.setUrl(request.getUrl());
        this.projectRepo.save(project);
    }

    @Override
    public ProjectResponse getById(Long id) {
        var result = getProject(id);
        var response = convertObject(result, ProjectResponse.class);
        response.setIsActive(result.isActive());
        return response;
    }

    @Override
    public PaginationResponse<ProjectResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var page = commonComponent.findAllEntities(Project.class, PROJECT, keyword, searchAttributes, pageable);
        return getPaginationResponse(page, ProjectResponse.class);
    }

    @Override
    public List<ProjectResponse> getAll() {
        var result = this.projectRepo.findAll();
        return convertList(result, ProjectResponse.class);
    }

    @Override
    public void changeStage(Long id, Long stageId) {
        var project = getProject(id);
        var projectStage = commonComponent.getEntity(stageId, Stage.class, STAGE);
        project.setStage(projectStage);
        this.projectRepo.save(project);
    }

    @Override
    public void removeTask(Long projectId, Long taskId) {
        var task = this.taskRepo.findByProjectIdAndId(projectId, taskId).orElseThrow(throwNotFoundException(taskId, projectId, PROJECT, TASK));
        task.setActive(false);
        this.taskRepo.save(task);
    }

    @Override
    public void changeManager(ChangeManagerRequest request) {
        var newManager = this.userRepo.findById(request.newUserId()).orElseThrow(throwNotFoundException(request.newUserId(), USER));
        var project =  this.projectRepo.findByIdAndUserId(request.projectId(), request.oldUserId()).orElseThrow(
                throwNotFoundException(request.projectId(), request.oldUserId(), PROJECT, USER));
        project.setUser(newManager);
        this.projectRepo.save(project);
    }

    @Override
    public void changeVisibility(Long id, Boolean isPrivate) {
        var project = getProject(id);
        project.setIsPrivate(isPrivate);
        // todo: if the project is changed to private, assignees should be removed
        this.projectRepo.save(project);
    }

    @Override
    public void delete(Long id) {
        var result = getProject(id);
        result.setActive(false);
        this.projectRepo.save(result);
    }

    @Override
    public void enable(Long id) {
        var project = getProject(id);
        project.setActive(true);
        this.projectRepo.save(project);
    }

    @Override
    public ProjectResponse duplicate(Long id) {
        var result = duplicateComponent.duplicateProject(id);
        return convertObject(result, ProjectResponse.class);
    }

    public Project getProject(Long id) {
        return this.projectRepo.findById(id).orElseThrow(throwNotFoundException(id, PROJECT));
    }
}
