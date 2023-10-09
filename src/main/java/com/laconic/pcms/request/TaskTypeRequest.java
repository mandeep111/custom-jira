package com.laconic.pcms.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import static com.laconic.pcms.constants.ValidationConstants.NAME_MESSAGE;
import static com.laconic.pcms.constants.ValidationConstants.USER_MESSAGE;

@Data
public class TaskTypeRequest {
    private Long id;
    @NotNull(message = USER_MESSAGE)
    private Long userId;

    @NotNull(message = NAME_MESSAGE)
    @NotEmpty(message = NAME_MESSAGE)
    private String name;
    private String description;
    private String color;
    private boolean isFold;
    private Boolean isActive;
}
