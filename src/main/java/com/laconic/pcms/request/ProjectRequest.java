package com.laconic.pcms.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.laconic.pcms.constants.ValidationConstants;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.List;

import static com.laconic.pcms.constants.ValidationConstants.*;

@Data
public class ProjectRequest {
    private Long id;
    @NotNull(message = SPACE_MESSAGE)
    private Long spaceId;
//    @NotNull(message = COMPANY_MESSAGE)
//    private Long companyId;
    @NotNull(message = USER_MESSAGE)
    private Long userId;
    @NotNull(message = PROJECT_STAGE_MESSAGE)
    private Long stageId;
    private String color;
    @NotNull(message = ValidationConstants.NAME_MESSAGE)
    @NotEmpty(message = ValidationConstants.NAME_MESSAGE)
    private String name;
    private String label;
    private String description;
    private Boolean isRecurringAllowed;
    private String lastUpdateStatus;
    @JsonProperty(value = "end")
    private Date deadlineDate;
    @JsonProperty(value = "start")
    private Date startDate;
    private String allocatedHours;
//    List<Long> taskTypes;
    List<IdRequest> taskStages;
    private Boolean isPrivate;
    private Boolean isActive;
    private String url;
}
