package com.laconic.pcms.response;

import com.laconic.pcms.dto.SpaceDto;

import java.util.List;

public record GroupByResponse(SpaceDto space, List<TaskResponse> taskResponse) {
}
