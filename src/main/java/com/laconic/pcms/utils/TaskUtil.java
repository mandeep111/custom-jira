package com.laconic.pcms.utils;

import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.Space;
import com.laconic.pcms.entity.Task;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.TaskResponse;
import org.jetbrains.annotations.NotNull;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class TaskUtil {
    public static TaskResponse mapProgress(TaskResponse result) {
        if (!result.getSubTasks().isEmpty()) {
            long completed = result.getSubTasks().stream().filter(st -> st.getStatus().equals(ProgressStatus.COMPLETED)).count();
            long total = result.getSubTasks().size();
            // Cast either completed or total to double for floating-point division
            double progress = ((double) completed / total) * 100;
            result.setProgress(progress); // calculate progress percentage
        }
        return result;
    }

    public static Double getProjectProgress(ProjectResponse project) {
        if (!project.getTasks().isEmpty()) {
            double totalProgress = project.getTasks().stream()
                    .mapToDouble(TaskResponse::getProgress)
                    .sum();
            long total = project.getTasks().size();
            return (totalProgress / total);
        }
        return 0.0;
    }

    @NotNull
    public static List<Project> getFilteredProjects(String userEmail, Set<Project> projects) {
        return projects.stream()
                .map(project -> {
                    List<Task> filteredTasks = getFilteredTasks(userEmail, project.getTasks());
                    project.setTasks(new HashSet<>(filteredTasks));
                    return project;
                })
                .toList();
    }


    @NotNull
    public static List<Task> getFilteredTasks(String userEmail, Set<Task> tasks) {
        return tasks.stream()
                .filter(task -> !task.getIsPrivate() || task.getUsers().stream().anyMatch(user -> user.getEmail().equals(userEmail)))
                .toList();
    }


}
