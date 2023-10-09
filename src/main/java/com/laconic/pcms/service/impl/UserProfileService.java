package com.laconic.pcms.service.impl;

import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.SubTask;
import com.laconic.pcms.entity.Task;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.ISubTaskRepo;
import com.laconic.pcms.repository.ITaskRepo;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.SubTaskResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.service.concrete.IUserProfileService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.laconic.pcms.utils.AuthenticationUtil.getCurrentUser;
import static com.laconic.pcms.utils.AutoMapper.convertList;

@Service
public class UserProfileService implements IUserProfileService {
    private final ITaskRepo taskRepo;
    private final IProjectRepo projectRepo;
    private final ISubTaskRepo subTaskRepo;

    public UserProfileService(ITaskRepo taskRepo, IProjectRepo projectRepo, ISubTaskRepo subTaskRepo) {
        this.taskRepo = taskRepo;
        this.projectRepo = projectRepo;
        this.subTaskRepo = subTaskRepo;
    }

    @Override
    public List<TaskResponse> getMyTasks() {
        var tasks = getAllTasksByAssignee();
        return convertList(tasks, TaskResponse.class);
    }

    @Override
    public List<ProjectResponse> getMyProjects() {
        List<Project> projects = getAllProjectsByAssignee();
        return convertList(projects, ProjectResponse.class);
    }

    @Override
    public List<SubTaskResponse> getMySubTasks() {
        List<SubTask> subTasks = getAllSubTasksByAssignee();
        return convertList(subTasks, SubTaskResponse.class);
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

        response.put("task_completed", (int) tasks.stream().filter(t->t.getTaskStage().getName().equals("DONE")).count());
        response.put("project_completed", (int) projects.stream().filter(p->p.getStage().getName().equals("DONE")).count());
        response.put("sub_task_completed", (int) subTasks.stream().filter(st->st.getStatus().equals(ProgressStatus.COMPLETED)).count());
        return response;
    }

    private List<Task> getAllTasksByAssignee() {
        return this.taskRepo.findAllByAssignees_Id(getCurrentUser().getId());
    }

    private List<Project> getAllProjectsByAssignee() {
        return this.projectRepo.findAllByUserId(getCurrentUser().getId());
    }

    private List<SubTask> getAllSubTasksByAssignee() {
        return this.subTaskRepo.findAllByAssigneeId(getCurrentUser().getId());
    }
}
