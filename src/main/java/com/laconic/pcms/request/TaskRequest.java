package com.laconic.pcms.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.List;
import static com.laconic.pcms.constants.ValidationConstants.*;

@Data
public class TaskRequest {
    private Long id;
    @NotNull(message = TASK_TYPE_MESSAGE)
    private Long taskStageId;
    @NotNull(message = PROJECT_MESSAGE)
    private Long projectId;
//    @NotNull(message = COMPANY_MESSAGE)
//    private Long companyId;
    private Long milestoneId;

    @NotNull(message = NAME_MESSAGE)
    @NotEmpty(message = NAME_MESSAGE)
    private String name;
    private String description;
    private String color;
    private String priority;
    @JsonProperty(value = "end")
    private Date deadlineDate;
    @JsonProperty(value = "start")
    private Date assignedDate;
    private Boolean isBlocked;
    private Boolean isClosed;
    private Integer progress;
/*    List<Long> assignee;
    List<Long> tags;  */
    List<IdRequest> assignee;
    List<IdRequest> tags;
    private String type = "task";
    private Boolean isActive = true;
}
