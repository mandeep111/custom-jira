package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.FavoriteComponent;
import com.laconic.pcms.component.FolderComponent;
import com.laconic.pcms.entity.*;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.repository.*;
import com.laconic.pcms.response.*;
import com.laconic.pcms.service.concrete.IUserProfileService;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import com.laconic.pcms.utils.TaskUtil;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.laconic.pcms.constants.AppMessages.SPACE;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class UserProfileService implements IUserProfileService {
    private final ITaskRepo taskRepo;
    private final IProjectRepo projectRepo;
    private final ISubTaskRepo subTaskRepo;
    private final ISpaceRepo spaceRepo;
    private final IFavoriteSpaceRepo favoriteSpaceRepo;
    private final IFavoriteProjectRepo favoriteProjectRepo;
    private final FavoriteComponent favoriteComponent;
    private final FolderComponent folderComponent;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;

    public UserProfileService(ITaskRepo taskRepo, IProjectRepo projectRepo, ISubTaskRepo subTaskRepo, ISpaceRepo spaceRepo, IFavoriteSpaceRepo favoriteSpaceRepo, IFavoriteProjectRepo favoriteProjectRepo, FavoriteComponent favoriteComponent, FolderComponent folderComponent, KeyCloakAuthenticationUtil keyCloakAuthenticationUtil) {
        this.taskRepo = taskRepo;
        this.projectRepo = projectRepo;
        this.subTaskRepo = subTaskRepo;
        this.spaceRepo = spaceRepo;
        this.favoriteSpaceRepo = favoriteSpaceRepo;
        this.favoriteProjectRepo = favoriteProjectRepo;
        this.favoriteComponent = favoriteComponent;
        this.folderComponent = folderComponent;
        this.keyCloakAuthenticationUtil = keyCloakAuthenticationUtil;
    }

    @Override
    public List<TaskResponse> getMyTasks() {
        var tasks = getAllTasksByAssignee();
        var result = convertList(tasks, TaskResponse.class);
        return result.stream().map(TaskUtil::mapProgress).toList();
    }

    @Override
    public List<ProjectResponse> getMyProjects() {
        List<Project> projects = getAllProjectsByAssignee();
        return convertList(projects, ProjectResponse.class);
    }


    @Override
    public List<ProjectResponse> getMyFavoriteProjects() {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        var favoriteProjects = this.favoriteProjectRepo.findAllByUserId(currentUser.getId());
        return favoriteProjects.stream().map(fp -> {
            var projectResponse = convertObject(fp.getProject(), ProjectResponse.class);
            projectResponse.setIsFavorite(true);
            return projectResponse;
        }).toList();
    }

    @Override
    public List<SpaceResponse> getMyFavoriteSpaces() {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        List<FavoriteSpace> favoriteSpaces = favoriteSpaceRepo.findAllByUserId(currentUser.getId());
        return favoriteSpaces.stream()
                .map(fp -> {
                    Space space = fp.getSpace();
                    SpaceResponse spaceResponse = convertObject(space, SpaceResponse.class);
                    spaceResponse.setIsFavorite(true);
                    spaceResponse.setFolders(folderComponent.getFolderResponses(space.getFolders().stream().toList()));
                    return spaceResponse;
                }).toList();
    }

    @Override
    public List<SubTaskResponse> getMySubTasks() {
        List<SubTask> subTasks = getAllSubTasksByAssignee();
        return convertList(subTasks, SubTaskResponse.class);
    }

    @Override
    public PaginationResponse<SpaceResponse> getMyFavoriteSpaces(int pageNo, int pageSize, String sortBy, String sortDir) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var currentUser = keyCloakAuthenticationUtil.getUser();
        var page = this.favoriteSpaceRepo.findAllByUserId(currentUser.getId(), pageable);
        List<SpaceResponse> response = page.getContent().stream()
                .map(fp -> {
                    Space space = fp.getSpace();
                    SpaceResponse spaceResponse = convertObject(space, SpaceResponse.class);
                    spaceResponse.setIsFavorite(true);
                    spaceResponse.setFolders(folderComponent.getFolderResponses(space.getFolders().stream().toList()));
                    return spaceResponse;
                })
                .toList();
        return new PaginationResponse<>(favoriteComponent.mapFavoriteSpaces(response), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public PaginationResponse<ProjectResponse> getMyFavoriteProjects(int pageNo, int pageSize, String sortBy, String sortDir) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var currentUser = keyCloakAuthenticationUtil.getUser();
        var page = this.favoriteProjectRepo.findAllByUserId(currentUser.getId(), pageable);
        List<ProjectResponse> response = page.getContent().stream().map(fp -> {
            ProjectResponse projectResponse = convertObject(fp.getProject(), ProjectResponse.class);
            projectResponse.setIsFavorite(true);
            return projectResponse;
        }).toList();
        return new PaginationResponse<>(favoriteComponent.mapFavoriteProjects(response), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public PaginationResponse<TaskResponse> getMyTasks(int pageNo, int pageSize, String sortBy, String sortDir) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var currentUser = keyCloakAuthenticationUtil.getUser();
        var page = this.taskRepo.findAllByUsers_Id(currentUser.getId(), pageable);
        List<TaskResponse> result = page.getContent().stream()
                .map(task -> {
                    TaskResponse taskResponse = convertObject(task, TaskResponse.class);
                    return TaskUtil.mapProgress(taskResponse);
                }).toList();
        return new PaginationResponse<>(result, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }


    @Override
    public PaginationResponse<SubTaskResponse> getMySubTasks(int pageNo, int pageSize, String sortBy, String sortDir) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var currentUser = keyCloakAuthenticationUtil.getUser();
        var page = this.subTaskRepo.findAllByUserId(currentUser.getId(), pageable);
        return getPaginationResponse(page, SubTaskResponse.class);
    }

    @Override
    public Map<String, Integer> getProfileCounts() {
        Map<String, Integer> response = new HashMap<>();
        var tasks = getAllTasksByAssignee();
        var projects = getAllProjectsByAssignee();
        var subTasks = getAllSubTasksByAssignee();
        response.put("task", getMyTasks().size());
        response.put("projects", getMyProjects().size());
        response.put("subTasks", getMySubTasks().size());

        response.put("task_completed", (int) tasks.stream().filter(t -> t.getTaskStage().getName().equals("DONE")).count());
        response.put("project_completed", (int) projects.stream().filter(p -> p.getStage().getName().equals("DONE")).count());
        response.put("sub_task_completed", (int) subTasks.stream().filter(st -> st.getStatus().equals(ProgressStatus.COMPLETED)).count());
        return response;
    }

    @Override
    // todo:: need to fix
    public Map<UserResponse, Map<String, Long>> getUserWorkload(Long spaceId, Date startDate, Date endDate) {
        var space = this.spaceRepo.findByIdAndIsPrivateFalseAndCreatedDateBetween(spaceId, startDate, endDate).orElseThrow(throwNotFoundException(spaceId, SPACE));
        return getUserWorkloadBySpace(space);
    }

    @Override
    public List<Map<UserResponse, Map<String, Long>>> getUserWorkloads(Date startDate, Date endDate) {
        List<Map<UserResponse, Map<String, Long>>> response = new ArrayList<>();
        var space = this.spaceRepo.findAllByIsPrivateFalseAndCreatedDateBetween(startDate, endDate);
        response.add(getUserWorkload(space));
        return response;
    }

    @Override
    public Map<UserResponse, Map<ProgressStatus, Long>> getUserSubTasksByProject(Long projectId, Date startDate, Date endDate) {
        var subTasks = this.subTaskRepo.findAllByProjectId(projectId, startDate, endDate);
        return getSubTasksCount(subTasks);
    }

    @Override
    public Map<UserResponse, Map<ProgressStatus, Long>> getUserSubTasksBySpace(Long spaceId, Date startDate, Date endDate) {
        var subTasks = this.subTaskRepo.findAllBySpaceId(spaceId, startDate, endDate);
        return getSubTasksCount(subTasks);
    }

    @Override
    public Map<UserResponse, Map<ProgressStatus, Long>> getAllSubTasks(Date startDate, Date endDate) {
        var subTasks = this.subTaskRepo.findAllByAssignedDateBetween(startDate,endDate);
        return getSubTasksCount(subTasks);
    }

    public Map<UserResponse, Map<String, Long>> getUserWorkload(List<Space> spaces) {
        Map<UserResponse, Map<String, Long>> mergedUserCountsMap = new HashMap<>();

        // Iterate over each space and merge the results
        spaces.forEach(space -> {
            Map<UserResponse, Map<String, Long>> userCountsMap = getUserWorkloadBySpace(space);

            // Merge the results for this space into the mergedUserCountsMap
            userCountsMap.forEach((user, counts) -> {
                mergedUserCountsMap.computeIfAbsent(user, u -> new HashMap<>());
                counts.forEach((key, value) -> mergedUserCountsMap.get(user).merge(key, value, Long::sum));
            });
        });
        return mergedUserCountsMap;
    }

    @NotNull
    private static Map<UserResponse, Map<String, Long>> getUserWorkloadBySpace(Space space) {
        Map<UserResponse, Map<String, Long>> userCountsMap = space.getUsers().stream()
                .collect(Collectors.toMap(
                        user -> convertObject(user, UserResponse.class),
                        user -> {
                            Map<String, Long> countsMap = new HashMap<>();
                            countsMap.put("projects", 0L);
                            countsMap.put("tasks", 0L);
                            countsMap.put("subtasks", 0L);
                            return countsMap;
                        },
                        (a, b) -> a // Merge function (keep the original)
                ));

        // Use Java streams to count projects, tasks, and subtasks assigned to users
        space.getProjects().forEach(project -> {
            var projectAssignee = convertObject(project.getUser(), UserResponse.class);
            if (projectAssignee != null) {
                userCountsMap.get(projectAssignee).compute("projects", (key, value) -> value + 1);
            }

            project.getTasks().forEach(task -> {
                var taskUsers = convertList(task.getUsers().stream().toList(), UserResponse.class);
                taskUsers.forEach(taskAssignee -> {
                    userCountsMap.get(taskAssignee).compute("tasks", (key, value) -> value + 1);
                });

                task.getSubTasks().forEach(subtask -> {
                    var subtaskAssignee = convertObject(subtask.getUser(), UserResponse.class);
                    if (subtaskAssignee != null) {
                        userCountsMap.get(subtaskAssignee).compute("subtasks", (key, value) -> value + 1);
                    }
                });
            });
        });

        return userCountsMap;
    }


    private List<Task> getAllTasksByAssignee() {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        return this.taskRepo.findAllByUsers_Id(currentUser.getId());
    }

    private List<Project> getAllProjectsByAssignee() {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        return this.projectRepo.findAllByUserId(currentUser.getId());
    }

    private List<SubTask> getAllSubTasksByAssignee() {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        return this.subTaskRepo.findAllByUserId(currentUser.getId());
    }

    public Map<UserResponse, Map<ProgressStatus, Long>> getSubTasksCount(List<SubTask> subTasks) {
        // Group the subtasks by assigned user and convert User to UserResponse
        return subTasks.stream()
                .collect(Collectors.groupingBy(
                        subtask -> convertObject(subtask.getUser(), UserResponse.class),
                        Collectors.groupingBy(SubTask::getStatus, Collectors.counting())
                ));
    }
}
