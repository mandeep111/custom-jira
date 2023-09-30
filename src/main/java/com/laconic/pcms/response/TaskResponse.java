package com.laconic.pcms.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    private Integer progress;
    private Set<TagResponse> tags;
    private Set<UserResponse> assignees;
    private String type;
}
