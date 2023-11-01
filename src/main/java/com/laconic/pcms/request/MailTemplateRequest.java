package com.laconic.pcms.request;

import lombok.Data;

@Data
public class MailTemplateRequest {
    Long id;
    private String emailFrom;
    private String emailTo;
    private String name;
    private String description;
    private String subject;
    private String body;
    private String emailCC;
    private String replyTo;
    private String model;
    private Boolean isActive;
}
