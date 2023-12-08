package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.DuplicateComponent;
import com.laconic.pcms.entity.*;
import com.laconic.pcms.enums.NotificationType;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.enums.TaskPriority;
import com.laconic.pcms.event.TaskEvent;
import com.laconic.pcms.repository.*;
import com.laconic.pcms.request.GroupByRequest;
import com.laconic.pcms.request.IdRequest;
import com.laconic.pcms.request.TaskRequest;
import com.laconic.pcms.response.GroupByResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.service.concrete.ITaskService;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import com.laconic.pcms.utils.NotificationUtil;
import com.laconic.pcms.utils.TaskUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.specification.ProjectSpec.getByProjectId;
import static com.laconic.pcms.specification.TaskSpec.*;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;
import static com.laconic.pcms.utils.TaskUtil.*;

@Service
public class TaskService implements ITaskService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    private final ITaskRepo taskRepo;
    private final CommonComponent commonComponent;
    private final ITagRepo projectTagRepo;
    private final IUserRepo userRepo;
    private final DuplicateComponent duplicateComponent;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;
    private final NotificationUtil notificationUtil;
    private final ISubTaskRepo subTaskRepo;

    public TaskService(ITaskRepo taskRepo, CommonComponent commonComponent, ITagRepo projectTagRepo, IUserRepo userRepo, DuplicateComponent duplicateComponent, KeyCloakAuthenticationUtil keyCloakAuthenticationUtil, NotificationUtil notificationUtil, ISubTaskRepo subTaskRepo) {
        this.taskRepo = taskRepo;
        this.commonComponent = commonComponent;
        this.projectTagRepo = projectTagRepo;
        this.userRepo = userRepo;
        this.duplicateComponent = duplicateComponent;
        this.keyCloakAuthenticationUtil = keyCloakAuthenticationUtil;
        this.notificationUtil = notificationUtil;
        this.subTaskRepo = subTaskRepo;
    }

    /**
     * @param request
     */
    @Override
    @Transactional(rollbackOn = Exception.class)
    public void save(TaskRequest request) {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        var task = convertObject(request, Task.class);
        var project = commonComponent.getEntity(request.getProjectId(), Project.class, PROJECT);
        var taskStage = commonComponent.getEntity(request.getTaskStageId(), TaskStage.class, TASK_TYPE);
        task.setProject(project);
        task.setTaskStage(taskStage);
        // Fetch the project tags and assignee by their IDs
        var projectTags = new HashSet<>(projectTagRepo.findAllById(request.getTags().stream().map(IdRequest::id).toList()));
        var users = new HashSet<>(userRepo.findAllById(request.getUser().stream().map(IdRequest::id).toList()));
        checkAssignee(task.getProject().getSpace(), users);

        // set current user if the space is private
        if (request.getIsPrivate() && users.stream().noneMatch(u -> u.getId().equals(currentUser.getId()))) {
            users.add(currentUser);
        }
        task.setUsers(users);
        // Set the project tags for the project
        task.setTags(projectTags);
        task = this.taskRepo.save(task);
        var pmsUrlUi = task.getProject().getSpace().getId() +"/"+task.getProject().getSpace().getUrl()+
                "/"+ task.getProject().getId()+"/"+ task.getProject().getUrl();
        // send email notifications
        var emailUsers = users.stream().filter(u -> !u.getEmail().equals(currentUser.getEmail())).collect(Collectors.toSet());
        notificationUtil.sendEmails(emailUsers, NotificationType.task,task.getName(),pmsUrlUi);
        eventPublisher.publishEvent(new TaskEvent(task));
    }


    @Override
    public void update(TaskRequest request, Long id) {
        var task = getTask(id);
        task.setColor(request.getColor());
        task.setName(request.getName());
//        task.setPriority(request.getPriority());
        task.setDescription(request.getDescription());
        task.setDeadlineDate(request.getDeadlineDate());
        task.setAssignedDate(request.getAssignedDate());
        task.setIsClosed(request.getIsClosed());
        task.setIsBlocked(request.getIsBlocked());
//        task.setProgress(request.getProgress());
        this.taskRepo.save(task);
    }

    @Override
    public TaskResponse getById(Long id) {
        return convertObject(getTask(id), TaskResponse.class);
    }

    private Task getTask(Long id) {
        return taskRepo.findById(id).orElseThrow(throwNotFoundException(id, TASK));
    }

    @Override
    public PaginationResponse<TaskResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes, Long projectId, String email) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<Task> page;
        Specification<Task> baseSpec = Specification.where(null);
        if (projectId != null) {
            var byProjectId = getByProjectId(Task.class, projectId, "project");
            baseSpec = baseSpec.and(byProjectId);
        }
        if (keyword != null) {
            var specs = CommonComponent.getSpecification(Task.class, TASK, keyword, searchAttributes);
            baseSpec = baseSpec.and(specs);
        }
        page = this.taskRepo.findAll(baseSpec, pageable);
        var response = convertList(getFilteredTasks(email, new HashSet<>(page.getContent())), TaskResponse.class);
        return new PaginationResponse<>(response, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Override
    public List<TaskResponse> getAll(String email) {
        var result = this.taskRepo.findAll();
        return convertList(getFilteredTasks(email, new HashSet<>(result)), TaskResponse.class);
    }

    @Override
    public void delete(Long id) {
        var task = getTask(id);
        task.setActive(false);
        task = this.taskRepo.save(task);
        eventPublisher.publishEvent(new TaskEvent(task));
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
        Set<Tag> tags = new HashSet<>(task.getTags());
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
        Set<Tag> tags = new HashSet<>(task.getTags());
        tags.remove(tag);
        task.setTags(tags);
        task = this.taskRepo.save(task);
        return convertObject(task, TaskResponse.class);

    }

    @Override
    public List<TaskResponse> getTaskByProject(Long project, String email) {
        List<Task> tasks = taskRepo.findByProjectId(project);
        tasks = getFilteredTasks(email, new HashSet<>(tasks));
        return convertList(tasks, TaskResponse.class);
    }

    @Override
    public void enable(Long id) {
        var task = getTask(id);
        task.setActive(true);
        this.taskRepo.save(task);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public TaskResponse addAssignee(Long taskId, Long userId) {
        var task = getTask(taskId);
        var user = commonComponent.getEntity(userId, User.class, USER);
        checkAssignee(task.getProject().getSpace(), user);
        Set<User> users = new HashSet<>(task.getUsers());
        users.add(user);
        task.setUsers(users);
        task = this.taskRepo.save(task);
        var pmsUrlUi = task.getProject().getSpace().getId() +"/"+task.getProject().getSpace().getUrl()+
                       "/"+ task.getProject().getId()+"/"+ task.getProject().getUrl();
        notificationUtil.sendEmails(Set.of(user), NotificationType.task,task.getName(), pmsUrlUi);
        return convertObject(task, TaskResponse.class);
    }

    @Override
    @Transactional
    @Modifying
    public TaskResponse removeAssignee(Long taskId, Long userId) {
        var task = getTask(taskId);
        var user = commonComponent.getEntity(userId, User.class, USER);
        Set<User> users = new HashSet<>(task.getUsers());
        users.remove(user);
        task.setUsers(users);
        task = this.taskRepo.save(task);
        return convertObject(task, TaskResponse.class);
    }

    @Override
    public TaskResponse duplicateTask(Long taskId) {
        var task = duplicateComponent.duplicateTask(taskId);
        eventPublisher.publishEvent(new TaskEvent(task));
        notificationUtil.sendEmails(task.getUsers(), NotificationType.task,task.getName(), task.getName());
        return convertObject(task, TaskResponse.class);
    }

    @Override
    public TaskResponse changePriority(Long id, TaskPriority priority) {
        var projectTask = getTask(id);
        projectTask.setPriority(priority);
        projectTask = this.taskRepo.save(projectTask);
        return convertObject(projectTask, TaskResponse.class);
    }

    @Override
    public List<GroupByResponse> getGroupedTasks(String email, GroupByRequest request) {
        List<Task> tasks = new ArrayList<>();
        if (request.spaceId() != null && request.projectId()!= null) {
            tasks.addAll(this.taskRepo.findAll(getBySpaceAndProject(request.spaceId(), request.projectId())));
        } else if (request.projectId() != null) {
            tasks.addAll(this.taskRepo.findAll(tasksByProject(request.projectId())));
        } else if (request.spaceId() != null) {
            tasks.addAll(this.taskRepo.findAll(taskBySpace(request.spaceId())));
        } else tasks.addAll(this.taskRepo.findAll());

        return mapTasksToSpaces(tasks, request.filterBy(), email);
    }

    @Override
    @Transactional
    public TaskResponse resolveSubTasks(Long taskId) {
        var task = getTask(taskId);
        List<SubTask> blockedSubtasks = new ArrayList<>();
        task.getSubTasks().forEach(u -> u.setStatus(ProgressStatus.COMPLETED));
        task.setProgress(100.0);

        // set task progress to 100
        task = this.taskRepo.saveAndFlush(task);

        // unblock other subtasks
        task.getSubTasks().forEach(s -> {
            var blocked = this.subTaskRepo.findAllByBlockedBy(s.getId());
            blocked.forEach(bs ->{
                bs.setBlockedBy(null);
                bs.setIsBlocked(false);
            });
            blockedSubtasks.addAll(blocked);
        });

        if (!blockedSubtasks.isEmpty()) this.subTaskRepo.saveAll(blockedSubtasks);

        // publish task to map progress for the project
        eventPublisher.publishEvent(new TaskEvent(task));
        return convertObject(task, TaskResponse.class);
    }


    public static Set<TaskResponse> mapProgress(Set<TaskResponse> result) {
        return result.stream().map(TaskUtil::mapProgress).collect(Collectors.toSet());
    }

}