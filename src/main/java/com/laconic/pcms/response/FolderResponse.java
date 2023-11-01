package com.laconic.pcms.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Set;

@Data
public class FolderResponse {
    private Long id;
    private String color;
    private String name;
    private String description;
    private Boolean isActive;
    private Long spaceId;
    private String spaceName;
    private String spaceUrl;
    @JsonProperty("project")
    private Set<ProjectResponse> projectResponses;
}
