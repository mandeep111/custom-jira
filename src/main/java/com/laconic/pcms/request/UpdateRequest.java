package com.laconic.pcms.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import static com.laconic.pcms.constants.ValidationConstants.*;

@Data
public class UpdateRequest {
    private Long id;
    @NotNull(message = PROJECT_MESSAGE)
    private Long projectId;
    @NotNull(message = NAME_MESSAGE)
    @NotEmpty(message = NAME_MESSAGE)
    private String name;
    private String status;
    private String description;
    private Boolean isActive;
}
