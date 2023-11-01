package com.laconic.pcms.response;

import lombok.Data;

@Data
public class UpdateResponse {
    private Long id;
    private Long projectId;
    private String projectName;
    private String name;
    private String status;
    private String description;
    private Boolean isActive;
}
