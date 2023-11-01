package com.laconic.pcms.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceResponse {
    private Long id;
    private String name;
    private String tags;
    private String color;
    private String url;
    private List<ProjectResponse> projects;
    private List<FolderResponse> folders;
    @JsonProperty("assignee")
    private List<UserResponse> users;
    private Boolean isPrivate;
    private Boolean isOpen;
    private Boolean isFavorite;
}
