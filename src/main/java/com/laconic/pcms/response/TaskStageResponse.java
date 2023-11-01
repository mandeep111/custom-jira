package com.laconic.pcms.response;

import lombok.Data;

@Data
public class TaskStageResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String name;
    private String description;
    private boolean isFold;
    private String color;
}
