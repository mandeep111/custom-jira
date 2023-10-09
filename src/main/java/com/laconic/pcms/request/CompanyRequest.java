package com.laconic.pcms.request;

import com.laconic.pcms.constants.ValidationConstants;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompanyRequest {
    private Long id;
    @NotNull(message = ValidationConstants.NAME_MESSAGE)
    @NotEmpty(message = ValidationConstants.NAME_MESSAGE)
    private String name;
    private Boolean isActive;
}
