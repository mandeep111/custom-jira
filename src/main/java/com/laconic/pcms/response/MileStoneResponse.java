package com.laconic.pcms.response;

import lombok.Data;

import java.util.Date;

@Data
public class MileStoneResponse {
    Long id;
    private Long projectId;
    private String projectName;
    private String name;
    private Date deadlineDate;
    private boolean isReached;
}
