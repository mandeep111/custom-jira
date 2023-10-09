package com.laconic.pcms.request;

import jakarta.validation.constraints.NotNull;

public record ChangeManagerRequest(@NotNull Long projectId, @NotNull Long newUserId, @NotNull Long oldUserId) {}
