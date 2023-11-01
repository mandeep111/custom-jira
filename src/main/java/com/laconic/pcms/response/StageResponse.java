package com.laconic.pcms.response;

import lombok.Data;

@Data
public class StageResponse {
    Long id;
    Long mailTemplateId;
    String mailTemplateName;

    String name;
    boolean isFold;
}
