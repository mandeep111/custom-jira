package com.laconic.pcms.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.laconic.pcms.enums.ProgressStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.Date;

@Data
public class SubTaskResponse {
    private Long id;
    private Long taskId;
    private String taskName;

    private Long projectId;
    private String projectName;

    private String name;
    private String color;
    private String description;
    @JsonProperty(value = "end")
    private Date deadlineDate;
    @JsonProperty(value = "start")
    private Date assignedDate;
    private boolean isBlocked;
    private boolean isClosed;
    UserResponse assignee;
    private String type;
    @Enumerated(EnumType.STRING)
    private ProgressStatus progressStatus;

    private Boolean needApproval;
    private String requestCode;
    private String url;
}
