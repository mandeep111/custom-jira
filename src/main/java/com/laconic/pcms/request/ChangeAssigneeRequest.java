package com.laconic.pcms.request;

import jakarta.validation.constraints.NotNull;

public record ChangeAssigneeRequest(@NotNull Long subTaskId, @NotNull Long userId) {
}
