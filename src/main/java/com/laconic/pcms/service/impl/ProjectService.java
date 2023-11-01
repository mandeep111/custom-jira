package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.DuplicateComponent;
import com.laconic.pcms.component.FavoriteComponent;
import com.laconic.pcms.entity.*;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.*;
import com.laconic.pcms.request.*;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.service.concrete.IProjectService;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;
import static com.laconic.pcms.utils.TaskUtil.getFilteredProjects;
import static com.laconic.pcms.utils.TaskUtil.getFilteredTasks;
import static org.springframework.data.jpa.domain.Specification.where;

@Service
public class ProjectService implements IProjectService {
    private final CommonComponent commonComponent;
    private final IProjectRepo projectRepo;
    private final ITaskStageRepo taskStageRepo;
    private final ITaskRepo taskRepo;
    private final IUserRepo userRepo;
    private final DuplicateComponent duplicateComponent;
    private final FavoriteComponent favoriteComponent;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;

    public ProjectService(CommonComponent commonComponent, IProjectRepo projectRepo, ITaskStageRepo taskStageRepo, ITaskRepo taskRepo, IUserRepo userRepo, DuplicateComponent duplicateComponent, FavoriteComponent favoriteComponent, KeyCloakAuthenticationUtil keyCloakAuthenticationUtil) {
        this.commonComponent = commonComponent;
        this.projectRepo = projectRepo;
        this.taskStageRepo = taskStageRepo;
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
        this.duplicateComponent = duplicateComponent;
        this.favoriteComponent = favoriteComponent;
        this.keyCloakAuthenticationUtil = keyCloakAuthenticationUtil;
    }

    @Override
    public void save(ProjectRequest request) {
        var space = commonComponent.getEntity(request.getSpaceId(), Space.class, SPACE);
        var project = convertObject(request, Project.class);
        if (request.getUserId() != null) {
            var user = userRepo.findByIdAndSpaces_Id(request.getUserId(), request.getSpaceId()).orElseThrow(throwNotFoundException(request.getUserId(), request.getSpaceId(), SPACE, USER));
            project.setUser(user); // manager
        }
        if (request.getFolderId() != null) {
            var folder = commonComponent.getEntity(request.getFolderId(), Folder.class, FOLDER);
            project.setFolder(folder); // project inside folder
        }
        var projectStage = commonComponent.getEntity(request.getStageId(), Stage.class, STAGE);
        project.setStage(projectStage);
        if (space.getIsPrivate() && !project.getIsPrivate()) {
            throw new PreconditionFailedException("projects should be private in a private space"); // projects are private in a private space
        }
        project.setSpace(space);
        project.setStartDate(request.getStartDate());
        project.setDeadlineDate(request.getDeadlineDate());

        // Fetch the task types by their IDs
        List<TaskStage> taskStages = taskStageRepo.findAllById(request.getTaskStages().stream().map(IdRequest::id).toList());

        // Set the task types for the project
        project.setTaskStages(new HashSet<>(taskStages));
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
        project.setIsRecurringAllowed(request.getIsRecurringAllowed());
        project.setStartDate(request.getStartDate());
        project.setDeadlineDate(request.getDeadlineDate());
        project.setAllocatedHours(request.getAllocatedHours());
        project.setUrl(request.getUrl());
        this.projectRepo.save(project);
    }

    @Override
    public ProjectResponse getById(Long id, String email) {
        var result = getProject(id);
        result.setTasks(new HashSet<>(getFilteredTasks(email, result.getTasks())));
        var response = convertObject(result, ProjectResponse.class);
        response.setIsActive(result.isActive());
        response.setIsFavorite(favoriteComponent.getIsFavoriteProject(id));
        return response;
    }

    @Override
    public PaginationResponse<ProjectResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes, String email) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<Project> page;
        if (keyword != null) {
            var specs = CommonComponent.getSpecification(Project.class, PROJECT, keyword, searchAttributes);
            page = this.projectRepo.findAll(specs, pageable);
        } else page = this.projectRepo.findAll(pageable);
        var content = convertList(getFilteredProjects(email, new HashSet<>(page.getContent())), ProjectResponse.class);
        return new PaginationResponse<>(favoriteComponent.mapFavoriteProjects(content),
                page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public List<ProjectResponse> getAll(String email) {
        var result = this.projectRepo.findAll();
        result = getFilteredProjects(email, new HashSet<>(result));
        var response = convertList(result, ProjectResponse.class);
        return favoriteComponent.mapFavoriteProjects(response);
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
        var project = this.projectRepo.findByIdAndUserId(request.projectId(), request.oldUserId()).orElseThrow(
                throwNotFoundException(request.projectId(), request.oldUserId(), PROJECT, USER));
        if (project.getSpace().getUsers().stream().noneMatch(u -> u.getId().equals(newManager.getId()))) {
            throw new PreconditionFailedException("User not present in this space");
        }
        project.setUser(newManager);
        this.projectRepo.save(project);
    }

    @Override
    public void changeVisibility(Long id, Boolean isPrivate) {
        var project = getProject(id);
        if (project.getSpace().getIsPrivate() && isPrivate) {
            throw new PreconditionFailedException("Private Space can not have public project");
        }
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

    @Override
    public ProjectResponse updateName(String name, Long id) {
        var project = getProject(id);
        project.setName(name);
        project = this.projectRepo.save(project);
        return convertObject(project, ProjectResponse.class);
    }

    @Override
    public ProjectResponse updateColor(String color, Long id) {
        var project = getProject(id);
        project.setColor(color);
        project = this.projectRepo.save(project);
        return convertObject(project, ProjectResponse.class);
    }

    @Override
    public ProjectResponse moveToSpace(Long id, Long spaceId) {
        var project = getProject(id);
        var space = commonComponent.getEntity(spaceId, Space.class, SPACE);
        project.setSpace(space);
        project.setFolder(null);
        project = this.projectRepo.save(project);
        return convertObject(project, ProjectResponse.class);
    }

    @Override
    public ProjectResponse moveToFolder(Long id, Long spaceId, Long folderId) {
        var project = getProject(id);
        var space = commonComponent.getEntity(spaceId, Space.class, SPACE);
        var folder = commonComponent.getEntity(folderId, Folder.class, FOLDER);
//        if (!project.getSpace().equals(folder.getSpace())) {
//            throw new PreconditionFailedException("Folder should be in same space");
//        }
        project.setSpace(space);
        project.setFolder(folder);
        project = this.projectRepo.save(project);
        return convertObject(project, ProjectResponse.class);
    }

    @Override
    public ProjectResponse moveOutOfFolder(Long id) {
        var project = getProject(id);
        project.setFolder(null);
        project = this.projectRepo.save(project);
        return convertObject(project, ProjectResponse.class);
    }

    @Override
    public List<ProjectResponse> getProjectReportByCompany(ProjectReportRequest request) {
        var projects = this.projectRepo.findAll(where(getByDateBetween(request.startDate(), request.endDate(), request.companyId())));
        var response = convertList(projects, ProjectResponse.class);
       /* response.forEach(r -> {
            double progress = TaskUtil.getProjectProgress(r);
            r.setProgress(progress);
        });*/
        return favoriteComponent.mapFavoriteProjects(response);
    }

    public static Specification<Project> getByDateBetween(Date startDate, Date endDate, Long companyId) {
        return (root, query, cb) -> {
            root.join("company");
            Predicate datePredicate = cb.between(root.get("deadlineDate"), startDate, endDate);
            Predicate companyPredicate = cb.equal(root.get("company").get("id"), companyId);
            return cb.and(datePredicate, companyPredicate);
        };
    }


    public Project getProject(Long id) {
        return this.projectRepo.findById(id).orElseThrow(throwNotFoundException(id, PROJECT));
    }


}
