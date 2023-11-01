package com.laconic.pcms.listener;

import com.laconic.pcms.event.TaskEvent;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.utils.TaskUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import static com.laconic.pcms.utils.AutoMapper.convertObject;

@Component
@RequiredArgsConstructor
public class TaskListener {

    private final IProjectRepo projectRepo;

    @EventListener
    @Transactional
    public void updateProjectProgress(TaskEvent event) {
        var _project = event.task().getProject();
        _project.setProgress(TaskUtil.getProjectProgress(convertObject(_project, ProjectResponse.class)));
        // todo: if progress is 100, move project to last stage
        this.projectRepo.saveAndFlush(_project);
    }
}
