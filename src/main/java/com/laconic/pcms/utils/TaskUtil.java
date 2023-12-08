package com.laconic.pcms.utils;

import com.laconic.pcms.dto.SpaceDto;
import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.Space;
import com.laconic.pcms.entity.Task;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.enums.GroupByEnum;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.response.GroupByResponse;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.SpaceResponse;
import com.laconic.pcms.response.TaskResponse;
import org.jetbrains.annotations.NotNull;

import java.util.*;
import java.util.stream.Collectors;

import static com.laconic.pcms.constants.AppMessages.USER_NOT_PRESENT;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;

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

    public static List<TaskResponse> sortByUserEmail(String userEmail, List<TaskResponse> taskResponses) {
        return taskResponses.stream()
                .sorted((taskResponse1, taskResponse2) -> {
                    boolean isUserInTask1 = taskResponse1.getUsers().stream()
                            .anyMatch(user -> user.getEmail().equals(userEmail));
                    boolean isUserInTask2 = taskResponse2.getUsers().stream()
                            .anyMatch(user -> user.getEmail().equals(userEmail));

                    if (isUserInTask1 && !isUserInTask2) {
                        return -1;
                    } else if (!isUserInTask1 && isUserInTask2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }).toList();
    }

    public static List<GroupByResponse> mapTasksToSpaces(List<Task> tasks, GroupByEnum groupBy, String email) {
        Map<SpaceDto, List<Task>> tasksBySpace = new HashMap<>();
        for (Task task : tasks) {
            var space = convertObject(task.getProject().getSpace(), SpaceDto.class);
            tasksBySpace
                    .computeIfAbsent(space, k -> new ArrayList<>())
                    .add(task);
        }
        return tasksBySpace.entrySet().stream()
                .map(entry -> {
                    List<TaskResponse> taskResponses = convertList(entry.getValue(), TaskResponse.class);
                    switch (groupBy) {
                        case STATUS -> taskResponses = taskResponses.stream().sorted(Comparator.comparing(TaskResponse::getProgress, Comparator.reverseOrder())).toList();
                        case ASSIGNEE -> taskResponses = sortByUserEmail(email, taskResponses);
                        case PRIORITY -> taskResponses = taskResponses.stream().sorted(Comparator.comparing(TaskResponse::getPriority)).toList();
                        case DUE_DATE -> taskResponses = taskResponses.stream().sorted(Comparator.comparing(TaskResponse::getDeadlineDate)).toList();
                        case COLOR -> taskResponses = taskResponses.stream().sorted(Comparator.comparing(TaskResponse::getColor, Comparator.reverseOrder())).toList();
                    }
                    return new GroupByResponse(entry.getKey(), taskResponses);
                }).toList();
    }

    public static void checkAssignee(Space space, User user) {
        // validate user is present in task or not
        if (space.getUsers().stream().noneMatch(a -> a.getId().equals(user.getId()))) {
            throw new PreconditionFailedException(String.format(USER_NOT_PRESENT, "space"));
        }
    }

    public static void checkAssignee(Space space, Set<User> userList) {
        // Create a set of user IDs in the space
        Set<Long> spaceUserIds = space.getUsers().stream()
                .map(User::getId)
                .collect(Collectors.toSet());

        // Check if all user IDs in userList are present in spaceUserIds
        boolean allUsersPresent = userList.stream()
                .allMatch(user -> spaceUserIds.contains(user.getId()));

        // If not all users are present, throw an exception
        if (!allUsersPresent) {
            throw new PreconditionFailedException(String.format(USER_NOT_PRESENT, "space"));
        }
    }

}
