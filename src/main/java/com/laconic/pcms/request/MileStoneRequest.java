package com.laconic.pcms.request;

import lombok.Data;

import java.util.Date;

@Data
public class MileStoneRequest {
    Long id;
    private Long projectId;
    private String name;
    private Date deadlineDate;
    private boolean isReached;
    private Boolean isActive;
}
