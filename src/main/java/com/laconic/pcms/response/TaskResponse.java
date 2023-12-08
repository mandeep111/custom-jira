package com.laconic.pcms.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.enums.TaskPriority;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class TaskResponse {
    private Long id;
    private Long taskStageId;
    private String taskStageName;
    private Long spaceId;
    private String spaceName;
    private Long projectId;
    private String projectName;
    private Long milestoneId;
    private String milestoneName;
    private String name;
    private String color;
    private String description;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority;
    @JsonProperty(value = "end")
    private Date deadlineDate;
    @JsonProperty(value = "start")
    private Date assignedDate;
    private boolean isBlocked;
    private boolean isClosed;
    private double progress;
    private Set<TagResponse> tags;
    @JsonProperty(value = "assignee")
    private Set<UserResponse> users;
    private Set<SubTaskResponse> subTasks;
    private String type;
    private ProgressStatus progressStatus;
    private String url;
}
