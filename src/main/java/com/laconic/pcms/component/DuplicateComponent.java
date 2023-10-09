package com.laconic.pcms.component;

import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.Task;
import com.laconic.pcms.entity.TaskStage;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.exceptions.NotFoundException;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.ISpaceRepo;
import com.laconic.pcms.repository.ITaskRepo;
import com.laconic.pcms.repository.ITaskStageRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

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
    public Project duplicateProject(Long projectId) {
        // Retrieve the existing project by its ID
        Project existingProject = projectRepo.findById(projectId)
                .orElseThrow(throwNotFoundException(projectId, PROJECT));

        // Clone the existing project
        Project duplicatedProject = new Project();
        duplicatedProject.setName("Copy of " + existingProject.getName()); // You can customize the name as needed
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
        List<TaskStage> duplicatedTaskStages = new ArrayList<>(existingProject.getTaskStages());
        duplicatedProject.setTaskStages(duplicatedTaskStages);


        List<Task> duplicateTasks = new ArrayList<>();
        existingProject.getTasks().forEach(t -> duplicateTasks.add(duplicateTask(t.getId())));
        duplicateTasks.forEach(dt -> dt.setProject(duplicatedProject));
        duplicatedProject.setTasks(duplicateTasks);
        // Save the duplicated project
        return projectRepo.saveAndFlush(duplicatedProject);
    }



    private TaskStage duplicateTaskStage(TaskStage taskStage) {
        // Create a new TaskStage and copy attributes
        TaskStage duplicatedTaskStage = new TaskStage();
        duplicatedTaskStage.setName("Copy of " + taskStage.getName()); // You can customize the name as needed
        duplicatedTaskStage.setDescription(taskStage.getDescription());
        duplicatedTaskStage.setIsFold(taskStage.getIsFold());
        duplicatedTaskStage.setColor(taskStage.getColor());
        return taskStageRepo.save(duplicatedTaskStage);
    }

    public Task duplicateTask(Long taskId) {
        Task existingTask = commonComponent.getEntity(taskId, Task.class, TASK);
        if (existingTask != null) {
            Project project = commonComponent.getEntity(existingTask.getProject().getId(), Project.class, PROJECT);
            List<User> existingAssignees = new ArrayList<>(existingTask.getAssignees());
            TaskStage taskStage = commonComponent.getEntity(existingTask.getTaskStage().getId(), TaskStage.class, TASK_TYPE);
            Task newTask = new Task();
            newTask.setName("Copy of " + existingTask.getName());
            newTask.setPriority(existingTask.getPriority());
            newTask.setDeadlineDate(existingTask.getDeadlineDate());
            newTask.setAssignedDate(existingTask.getAssignedDate());
            newTask.setIsClosed(existingTask.getIsClosed());
            newTask.setIsBlocked(existingTask.getIsBlocked());
            newTask.setColor(existingTask.getColor());
            newTask.setProject(project);
            newTask.setTaskStage(taskStage);
            newTask.setAssignees(existingAssignees);
            return taskRepo.save(newTask);
        } else {
            // Handle the case where the specified task ID doesn't exist
            throw new NotFoundException("Task not found with ID: " + taskId);
        }
    }
}
