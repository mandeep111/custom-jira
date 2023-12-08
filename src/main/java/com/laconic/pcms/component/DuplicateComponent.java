package com.laconic.pcms.component;

import com.laconic.pcms.entity.*;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.exceptions.NotFoundException;
import com.laconic.pcms.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Component
@RequiredArgsConstructor
public class DuplicateComponent {

    private final IProjectRepo projectRepo;
    private final ISpaceRepo spaceRepo;
    private final ITaskStageRepo taskStageRepo;
    private final CommonComponent commonComponent;
    private final ITaskRepo taskRepo;
    private final ISubTaskRepo subTaskRepo;

    @Transactional
    public Project duplicateProject(Long projectId) {
        // Retrieve the existing project by its ID
        Project existingProject = projectRepo.findById(projectId)
                .orElseThrow(throwNotFoundException(projectId, PROJECT));

        // Clone the existing project
        Project duplicatedProject = new Project();
        duplicatedProject.setName(existingProject.getName()); // You can customize the name as needed
        duplicatedProject.setDescription(existingProject.getDescription());
        duplicatedProject.setColor(existingProject.getColor());
        duplicatedProject.setLabel(existingProject.getLabel());
        duplicatedProject.setDescription(existingProject.getDescription());
        duplicatedProject.setIsPrivate(existingProject.getIsPrivate());
        duplicatedProject.setIsRecurringAllowed(existingProject.getIsRecurringAllowed());
        duplicatedProject.setStartDate(existingProject.getStartDate());
        duplicatedProject.setDeadlineDate(existingProject.getDeadlineDate());
        duplicatedProject.setAllocatedHours(existingProject.getAllocatedHours());
        duplicatedProject.setUrl(existingProject.getUrl());

        // Duplicate the associated user (manager)
        duplicatedProject.setUser(existingProject.getUser()); // Copy the manager

        // Duplicate the project stage
        duplicatedProject.setStage(existingProject.getStage());

        // Set the associated space
        duplicatedProject.setSpace(existingProject.getSpace());

        // Duplicate the project stage (TaskStage) associations
        Set<TaskStage> duplicatedTaskStages = new HashSet<>(existingProject.getTaskStages());
        duplicatedProject.setTaskStages(duplicatedTaskStages);


        Set<Task> duplicateTasks = new HashSet<>();
        existingProject.getTasks().forEach(t -> duplicateTasks.add(duplicateTask(t.getId())));
        duplicateTasks.forEach(dt -> dt.setProject(duplicatedProject));
        duplicatedProject.setTasks(duplicateTasks);
        if (existingProject.getFolder() != null) {
            duplicatedProject.setFolder(existingProject.getFolder());
        }
        // Save the duplicated project
        return projectRepo.saveAndFlush(duplicatedProject);
    }


    private TaskStage duplicateTaskStage(TaskStage taskStage) {
        // Create a new TaskStage and copy attributes
        TaskStage duplicatedTaskStage = new TaskStage();
        duplicatedTaskStage.setName(taskStage.getName()); // You can customize the name as needed
        duplicatedTaskStage.setDescription(taskStage.getDescription());
        duplicatedTaskStage.setIsFold(taskStage.getIsFold());
        duplicatedTaskStage.setColor(taskStage.getColor());
        return taskStageRepo.save(duplicatedTaskStage);
    }

    @Transactional
    public Task duplicateTask(Long taskId) {
        Task existingTask = commonComponent.getEntity(taskId, Task.class, TASK);
        if (existingTask != null) {
            Project project = commonComponent.getEntity(existingTask.getProject().getId(), Project.class, PROJECT);
            Set<User> existingAssignees = new HashSet<>(existingTask.getUsers());
            TaskStage taskStage = commonComponent.getEntity(existingTask.getTaskStage().getId(), TaskStage.class, TASK_TYPE);

            Task newTask = new Task();
            // duplicate sub task
            Set<SubTask> duplicateSubTask = new HashSet<>();
            existingTask.getSubTasks().forEach(st -> duplicateSubTask.add(duplicateSubTask(st.getId())));
            Task finalNewTask = newTask;
            duplicateSubTask.forEach(st -> st.setTask(finalNewTask));
            newTask.setName(existingTask.getName());
            newTask.setPriority(existingTask.getPriority());
            newTask.setDeadlineDate(existingTask.getDeadlineDate());
            newTask.setAssignedDate(existingTask.getAssignedDate());
            newTask.setIsClosed(existingTask.getIsClosed());
            newTask.setIsBlocked(existingTask.getIsBlocked());
            newTask.setColor(existingTask.getColor());
            newTask.setProject(project);
            newTask.setTaskStage(taskStage);
            newTask.setUsers(existingAssignees);
            newTask.setDescription(existingTask.getDescription());
            newTask.setIsPrivate(existingTask.getIsPrivate());

            newTask.setSubTasks(duplicateSubTask);
            newTask = taskRepo.saveAndFlush(newTask);
            this.subTaskRepo.saveAllAndFlush(duplicateSubTask);
            return newTask;
        } else {
            // Handle the case where the specified task ID doesn't exist
            throw new NotFoundException("Task not found with ID: " + taskId);
        }
    }

    @Transactional
    public SubTask duplicateSubTaskWithTask(Long id) {
        var existingSubTask = commonComponent.getEntity(id, SubTask.class, SUB_TASK);
        SubTask duplicatedSubTask = getSubTask(existingSubTask);
        duplicatedSubTask.setTask(existingSubTask.getTask());
        // Save the duplicated subtask to the repository
        return subTaskRepo.save(duplicatedSubTask);
    }

    public SubTask duplicateSubTask(Long id) {
        // todo: need to check
        var existingSubTask = commonComponent.getEntity(id, SubTask.class, SUB_TASK);
        // Save the duplicated subtask to the repository
        return getSubTask(existingSubTask);
    }

    @NotNull
    private static SubTask getSubTask(SubTask existingSubTask) {
        SubTask duplicatedSubTask = new SubTask();
        duplicatedSubTask.setName(existingSubTask.getName());
        duplicatedSubTask.setDescription(existingSubTask.getDescription());
        duplicatedSubTask.setDeadlineDate(existingSubTask.getDeadlineDate());
        duplicatedSubTask.setAssignedDate(existingSubTask.getAssignedDate());
        duplicatedSubTask.setType(existingSubTask.getType());
        duplicatedSubTask.setColor(existingSubTask.getColor());
        duplicatedSubTask.setRequestCode(existingSubTask.getRequestCode());
        duplicatedSubTask.setNeedApproval(existingSubTask.getNeedApproval());
        duplicatedSubTask.setUrl(existingSubTask.getUrl());
        duplicatedSubTask.setUser(existingSubTask.getUser());
        duplicatedSubTask.setIsBlocked(false);
        duplicatedSubTask.setPriority(existingSubTask.getPriority());
        duplicatedSubTask.setStatus(ProgressStatus.WAITING); // new sub-task should be on waiting
        return duplicatedSubTask;
    }

    public Space duplicateSpace(Long id) {
        var existingSpace = commonComponent.getEntity(id, Space.class, SPACE);
        var duplicateSpace = new Space();
        duplicateSpace.setIsPrivate(existingSpace.getIsPrivate());
        duplicateSpace.setTags(existingSpace.getTags());
        duplicateSpace.setColor(existingSpace.getColor());
        duplicateSpace.setUrl(existingSpace.getUrl());
        duplicateSpace.setName(existingSpace.getName());
        duplicateSpace.setUsers(new HashSet<>(existingSpace.getUsers()));
        this.spaceRepo.save(duplicateSpace);
        return duplicateSpace;
    }

}
