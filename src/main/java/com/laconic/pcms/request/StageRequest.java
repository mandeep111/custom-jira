package com.laconic.pcms.request;

import com.laconic.pcms.constants.ValidationConstants;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StageRequest {
    Long id;
    Long mailTemplateId;
    @NotNull(message = ValidationConstants.NAME_MESSAGE)
    @NotEmpty(message = ValidationConstants.NAME_MESSAGE)
    String name;
    boolean isFold;
    private Boolean isActive;
}
