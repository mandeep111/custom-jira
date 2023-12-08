package com.laconic.pcms.request;

import com.laconic.pcms.enums.GroupByEnum;

public record GroupByRequest(Long spaceId, Long projectId, GroupByEnum filterBy) {
}
