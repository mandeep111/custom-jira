package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.DuplicateComponent;
import com.laconic.pcms.component.FavoriteComponent;
import com.laconic.pcms.component.FolderComponent;
import com.laconic.pcms.entity.*;
import com.laconic.pcms.enums.NotificationType;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.*;
import com.laconic.pcms.request.IdRequest;
import com.laconic.pcms.request.SpaceRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.SpaceResponse;
import com.laconic.pcms.service.concrete.ISpaceService;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import com.laconic.pcms.utils.NotificationUtil;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static com.laconic.pcms.constants.AppMessages.SPACE;
import static com.laconic.pcms.specification.SpaceSpec.*;
import static com.laconic.pcms.specification.UserSpec.getByUserEmail;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;
import static com.laconic.pcms.utils.KeyCloakAuthenticationUtil.getUserEmail;
import static com.laconic.pcms.utils.TaskUtil.getFilteredProjects;

@Service
public class SpaceService implements ISpaceService {

    public static final String USER_TABLE_NAME = "users";
    private final ISpaceRepo spaceRepo;
    private final IUserRepo userRepo;
    private final IProjectRepo projectRepo;
    private final FavoriteComponent favoriteComponent;
    private final FolderComponent folderComponent;
    private final DuplicateComponent duplicateComponent;
    private final ITaskRepo taskRepo;
    private final ISubTaskRepo subTaskRepo;
    private final IFavoriteSpaceRepo favoriteSpaceRepo;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;
    private final NotificationUtil notificationUtil;

    public SpaceService(ISpaceRepo spaceRepo, IUserRepo userRepo, IProjectRepo projectRepo, FavoriteComponent favoriteComponent, FolderComponent folderComponent, DuplicateComponent duplicateComponent, ITaskRepo taskRepo, ISubTaskRepo subTaskRepo, IFavoriteSpaceRepo favoriteSpaceRepo, KeyCloakAuthenticationUtil keyCloakAuthenticationUtil, NotificationUtil notificationUtil) {
        this.spaceRepo = spaceRepo;
        this.userRepo = userRepo;
        this.projectRepo = projectRepo;
        this.favoriteComponent = favoriteComponent;
        this.folderComponent = folderComponent;
        this.duplicateComponent = duplicateComponent;
        this.taskRepo = taskRepo;
        this.subTaskRepo = subTaskRepo;
        this.favoriteSpaceRepo = favoriteSpaceRepo;
        this.keyCloakAuthenticationUtil = keyCloakAuthenticationUtil;
        this.notificationUtil = notificationUtil;
    }

    @Override
    public void save(SpaceRequest request) {
        var space = convertObject(request, Space.class);
        Set<User> users = new HashSet<>();
        var currentUser = keyCloakAuthenticationUtil.getUser();
        // private user can not add other assignee
        if (!request.getIsPrivate()) {
            users.addAll(this.userRepo.findAllById(request.getUserIds().stream().map(IdRequest::id).toList()));
        } else if (!request.getUserIds().isEmpty()) {
            throw new PreconditionFailedException("Private Space can not have assignee");
        }
        // email every user except the creator of space
        var emailUsers = users.stream().filter(u -> !u.getEmail().equals(currentUser.getEmail())).collect(Collectors.toSet());
        // check if current user is added or not
        if (users.stream().noneMatch(u -> u.getId().equals(currentUser.getId()))) {
            users.add(currentUser);
        }
        space.setUsers(users); // add currently logged-in user
        this.spaceRepo.save(space);
        var pmsUrlUi = space.getId() +"/"+space.getUrl();
        notificationUtil.sendEmails(emailUsers, NotificationType.space, space.getName(), pmsUrlUi);
    }


    @Override
    public void update(SpaceRequest request, Long id) {
        var space = getSpace(id);
        space.setIsPrivate(request.getIsPrivate());
        space.setTags(request.getTags());
        space.setColor(request.getColor());
        space.setUrl(request.getUrl());
        space.setName(request.getName());
        this.spaceRepo.save(space);
    }

    @Override
    public void delete(Long id) {
        var result = getSpace(id);
        var user = keyCloakAuthenticationUtil.getUser();
        var favSpace = this.favoriteSpaceRepo.findByUserIdAndSpaceId(user.getId(), id);
        favSpace.ifPresent(this.favoriteSpaceRepo::delete);
        List<Project> projects = this.projectRepo.findBySpaceId(id);
        for (Project project : projects) {
            project.setActive(false);
            List<Task> tasks = this.taskRepo.findByProjectId(project.getId());
            for (Task task : tasks) {
                task.setActive(false);
                List<SubTask> subTasks = this.subTaskRepo.findByTaskId(project.getId());
                for (SubTask subTask : subTasks) {
                    subTask.setActive(false);
                }
            }
        }
        this.projectRepo.saveAll(projects);
        result.setActive(false);
        this.spaceRepo.save(result);
    }

    @Override
    public PaginationResponse<SpaceResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes, String email) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<Space> page;
        if (keyword != null) {
            var specs = CommonComponent.getSpecification(Space.class, SPACE, keyword, searchAttributes);
            page = this.spaceRepo.findAll(specs, pageable);
        } else page = this.spaceRepo.findAll(pageable);
        List<SpaceResponse> response = getList(page.getContent(), email);
        return new PaginationResponse<>(favoriteComponent.mapFavoriteSpaces(response), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public List<SpaceResponse> getAll(String email) {
        var user = keyCloakAuthenticationUtil.getUser();
        // get spaces only if it is public or logged-in user is assigned to it
        var result = this.spaceRepo.findAll(getPublicOrAssignedToUser(user));
        var spaceResponse = getList(result, user.getEmail());
        return favoriteComponent.mapFavoriteSpaces(spaceResponse);
    }

    @NotNull
    private List<SpaceResponse> getList(List<Space> page,String email) {
        return page.stream()
                .map(space -> {
                    // Filter tasks based on the user
                    List<Project> filteredProjects = getFilteredProjects(email, space.getProjects());
                    // Create a SpaceResponse and set filtered projects
                    SpaceResponse spaceResponse = convertObject(space, SpaceResponse.class);
                    var projectResponse = convertList(filteredProjects, ProjectResponse.class);
                    // Set favorite projects after filtering
                    spaceResponse.setProjects(favoriteComponent.mapFavoriteProjects(projectResponse));
                    spaceResponse.setFolders(folderComponent.getFolderResponses(space.getFolders().stream().toList()));
                    return spaceResponse;
                }).toList();
    }

   /* private List<SpaceResponse> getList(List<Space> page) {
        return page.stream()
                .map(space -> {
                    SpaceResponse spaceResponse = convertObject(space, SpaceResponse.class);
                    spaceResponse.setFolders(folderComponent.getFolderResponses(space.getFolders().stream().toList()));
                    return spaceResponse;
                }).toList();
    }*/

    @Override
    public SpaceResponse getById(Long id, String email) {
        Space result = getSpace(id);
        var response = convertObject(result, SpaceResponse.class);
        var filteredProjects = getFilteredProjects(email, result.getProjects());
        var projectResponse = convertList(filteredProjects, ProjectResponse.class);
        // Set favorite projects after filtering
        response.setProjects(favoriteComponent.mapFavoriteProjects(projectResponse));
        response.setIsFavorite(favoriteComponent.getIsFavoriteSpace(id));
        response.setFolders(folderComponent.getFolderResponses(result.getFolders().stream().toList()));
        return response;
    }

    @Override
    public SpaceResponse duplicate(Long id) {
        var duplicateSpace = duplicateComponent.duplicateSpace(id);
        notificationUtil.sendEmails(duplicateSpace.getUsers(), NotificationType.space,duplicateSpace.getName(), duplicateSpace.getUrl());
        return convertObject(duplicateSpace, SpaceResponse.class);
    }

    @Override
    public void addAssignee(Long spaceId, List<Long> userIds) {
        Space space = getSpace(spaceId);
        // restrict adding people to space
        checkSpaceCreator(space);
        var newUsers = this.userRepo.findAllById(userIds);
        Set<User> existingUsers = new HashSet<>(space.getUsers());
        existingUsers.addAll(newUsers);
        space.setUsers(existingUsers);

        notificationUtil.sendEmails(new HashSet<>(newUsers), NotificationType.space,space.getName(), space.getUrl());
        this.spaceRepo.save(space);
    }

    private void checkSpaceCreator(Space space) {
        if (!Objects.equals(getUserEmail(), space.getCreatedBy())) {
            throw new PreconditionFailedException("No permission to add people. This space belongs to another user!");
        }
    }

    private Space getSpace(Long spaceId) {
        return this.spaceRepo.findById(spaceId).orElseThrow(throwNotFoundException(spaceId, SPACE));
    }

    @Override
    public void removeAssignee(Long spaceId, List<Long> userIds) {
        Space space = getSpace(spaceId);
        checkSpaceCreator(space);
        var users = this.userRepo.findAllById(userIds);
        Set<User> existingUsers = new HashSet<>(space.getUsers());
        users.forEach(existingUsers::remove);
        space.setUsers(existingUsers);
        this.spaceRepo.save(space);
    }

    @Override
    public void removeProjects(Long spaceId, List<Long> projectIds) {
        Space space = getSpace(spaceId);
        var projects = this.projectRepo.findAllById(projectIds);
        Set<Project> existingProjects = new HashSet<>(space.getProjects());
        projects.forEach(existingProjects::remove);
        space.setProjects(existingProjects);
        this.spaceRepo.save(space);
    }

    @Override
    public PaginationResponse<SpaceResponse> getAll(String email, int pageNo, int pageSize, String sortBy, String sortDir, String keyword) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<Space> page;
        if (keyword != null) {
            Specification<Space> users = getByUserEmail(email, USER_TABLE_NAME);
            page = this.spaceRepo.findAll(users.and(getBySpaceName(keyword)), pageable);
        } else page = this.spaceRepo.findAllByUsers_EmailEqualsIgnoreCase(email, pageable);
        return getPaginationResponse(page, SpaceResponse.class);
    }

    @Override
    public SpaceResponse getByUrlAndId(Long id, String url) {
        var result = this.spaceRepo.findByIdAndUrlEqualsIgnoreCase(id, url).orElseThrow(throwNotFoundException(id + ", " + url, SPACE, "ID AND URL"));
        var response = convertObject(result, SpaceResponse.class);
        response.setIsFavorite(favoriteComponent.getIsFavoriteSpace(id));
        response.setFolders(folderComponent.getFolderResponses(result.getFolders().stream().toList()));
        return response;
    }
    @Override
    public SpaceResponse getByUrl(String url) {
        var result = this.spaceRepo.findByUrlEqualsIgnoreCase(url).orElseThrow(throwNotFoundException(url, SPACE, "URL"));
        var response = convertObject(result, SpaceResponse.class);
        response.setIsFavorite(favoriteComponent.getIsFavoriteSpace(result.getId()));
        response.setFolders(folderComponent.getFolderResponses(result.getFolders().stream().toList()));
        return response;
    }

    @Override
    public SpaceResponse updateName(String name, Long id) {
        var space = getSpace(id);
        space.setName(name);
        space = this.spaceRepo.save(space);
        return convertObject(space, SpaceResponse.class);
    }

    @Override
    public SpaceResponse updateColor(String color, Long id) {
        var space = getSpace(id);
        space.setColor(color);
        space = this.spaceRepo.save(space);
        return convertObject(space, SpaceResponse.class);
    }

}
