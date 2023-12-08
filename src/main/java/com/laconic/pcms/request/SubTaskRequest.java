package com.laconic.pcms.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.enums.TaskPriority;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

import static com.laconic.pcms.constants.ValidationConstants.NAME_MESSAGE;
import static com.laconic.pcms.constants.ValidationConstants.PROJECT_MESSAGE;

@Data
public class SubTaskRequest {
    Long id;
    @NotNull(message = PROJECT_MESSAGE)
    private Long taskId;
    @NotNull(message = NAME_MESSAGE)
    @NotEmpty(message = NAME_MESSAGE)
    private String name;
    private String description;
    private String color;
    @JsonProperty(value = "end")
    private Date deadlineDate;
    @JsonProperty(value = "start")
    private Date assignedDate;
    private Boolean isBlocked;
    private Long blockedBy;
    private Boolean isClosed;
    @JsonProperty(value = "assigneeId")
    Long userId;
    private String type;
    private Boolean isActive = true;
    @Enumerated(EnumType.STRING)
    private ProgressStatus status;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority;

    private Boolean needApproval;
    private String requestCode;
    private Long formId;
}
