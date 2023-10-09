package com.laconic.pcms.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.laconic.pcms.enums.ProgressStatus;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class TaskResponse {
    private Long id;
    private Long taskStageId;
    private String taskStageName;

    private Long projectId;
    private String projectName;

//    private Long companyId;
//    private String companyName;

    private Long milestoneId;
    private String milestoneName;

    private String name;
    private String color;
    private String description;
    private String priority;
    @JsonProperty(value = "end")
    private Date deadlineDate;
    @JsonProperty(value = "start")
    private Date assignedDate;
    private boolean isBlocked;
    private boolean isClosed;
    private double progress;
    private Set<TagResponse> tags;
    private Set<UserResponse> assignees;
    private Set<SubTaskResponse> subTasks;
    private String type;
    private ProgressStatus progressStatus;
}
