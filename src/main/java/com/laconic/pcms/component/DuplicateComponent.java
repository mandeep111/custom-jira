package com.laconic.pcms.component;

import com.laconic.pcms.entity.*;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.ISpaceRepo;
import com.laconic.pcms.repository.ITaskStageRepo;
import com.laconic.pcms.response.ProjectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static com.laconic.pcms.constants.AppMessages.PROJECT;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Component
@RequiredArgsConstructor
public class DuplicateComponent {

    private final IProjectRepo projectRepo;
    private final ISpaceRepo spaceRepo;
    private final ITaskStageRepo taskStageRepo;
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

    /*public void duplicateTask(TaskRequest request, Long taskId) {
        // Fetch the existing task by its ID
        Task existingTask = commonComponent.getEntity(taskId, Task.class, TASK);

        if (existingTask != null) {
            // Create a new Task by copying the properties of the existing task
            Task newTask = new Task();
            newTask.setName(request.getName()); // You can set other properties as needed

            // Optionally, you can copy other properties here, such as description, due date, etc.

            // Fetch and set the project associated with the new task
            Project project = commonComponent.getEntity(request.getProjectId(), Project.class, PROJECT);
            newTask.setProject(project);

            // Fetch and set the task stage associated with the new task
            TaskStage taskStage = commonComponent.getEntity(request.getTaskStageId(), TaskStage.class, TASK_TYPE);
            newTask.setTaskStage(taskStage);

            // Optionally, you can set the milestone, tags, and assignees here similar to your "save" function

            // Save the new task to the repository
            projectTaskRepo.save(newTask);
        } else {
            // Handle the case where the specified task ID doesn't exist
            throw new EntityNotFoundException("Task not found with ID: " + taskId);
        }
    }*/


}
