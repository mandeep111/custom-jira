package com.laconic.pcms.listener;

import com.laconic.pcms.event.SubTaskEvent;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.ISubTaskRepo;
import com.laconic.pcms.repository.ITaskRepo;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.utils.TaskUtil;
import jakarta.transaction.Transactional;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import static com.laconic.pcms.utils.AutoMapper.convertObject;

@Component
public class SubTaskListener {

    private final ITaskRepo taskRepo;
    private final IProjectRepo projectRepo;
    private final ISubTaskRepo subTaskRepo;

    public SubTaskListener(ITaskRepo taskRepo, IProjectRepo projectRepo, ISubTaskRepo subTaskRepo) {
        this.taskRepo = taskRepo;
        this.projectRepo = projectRepo;
        this.subTaskRepo = subTaskRepo;
    }

    @EventListener
    @Transactional
    @Order(1)
    public void updateTaskProgress(SubTaskEvent event) {
        var _task = event.subTask().getTask();
        var response = TaskUtil.mapProgress(convertObject(_task, TaskResponse.class));
        _task.setProgress(response.getProgress());

        // todo: if progress is 100, move task to last stage
        this.taskRepo.saveAndFlush(_task);
    }

    @EventListener
    @Transactional
    @Order(2)
    public void updateProjectProgress(SubTaskEvent event) {
        var _project = event.subTask().getTask().getProject();
        _project.setProgress(TaskUtil.getProjectProgress(convertObject(_project, ProjectResponse.class)));
        // todo: if progress is 100, move project to last stage
        this.projectRepo.saveAndFlush(_project);
    }

    @EventListener
    @Transactional
    @Order(3)
    public void unblockSubtasks(SubTaskEvent event) {
        var subtask = event.subTask();
        var blockedSubTasks = this.subTaskRepo.findAllByBlockedBy(subtask.getId());
        blockedSubTasks.forEach(bs ->{
            bs.setBlockedBy(null);
            bs.setIsBlocked(false);
        });
        this.subTaskRepo.saveAllAndFlush(blockedSubTasks);
    }

}
