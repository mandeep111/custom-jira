package com.laconic.pcms.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class ProjectResponse {
    private Long id;
    private Long companyId;
    private String companyName;
    private Long userId;
    private String userName;
    private Long stageId;
    private String stageName;
    private String color;
    private String name;
    private String label;
    private String description;
    private boolean isRecurringAllowed;
    private String lastUpdateStatus;
    @JsonProperty(value = "end")
    private Date deadlineDate;
    @JsonProperty(value = "start")
    private Date startDate;
    private String allocatedHours;
    private Set<TaskStageResponse> taskStages;
    private Set<TaskResponse> tasks;
    private String url;
    private Boolean isActive;
    private Long spaceId;
    private String spaceName;
    private Long folderId;
    private String folderName;
    private Double progress;
    private Boolean isFavorite;
}
