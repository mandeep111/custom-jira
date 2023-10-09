package com.laconic.pcms.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

import static com.laconic.pcms.constants.ValidationConstants.NAME_MESSAGE;

@Data
public class SpaceRequest {
    @NotNull(message = NAME_MESSAGE)
    @NotEmpty(message = NAME_MESSAGE)
    private String name;
    private String tags;
    private String color;
    private String url;
//    private List<Long> userIds;
    private List<IdRequest> userIds;
    private Boolean isPrivate;
    private Boolean isActive = true;
    private Boolean isOpen = true;
}
