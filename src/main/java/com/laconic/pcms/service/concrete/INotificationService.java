package com.laconic.pcms.service.concrete;

import com.laconic.pcms.entity.Notification;
import com.laconic.pcms.response.PaginationResponse;

import java.util.List;

public interface INotificationService {
    PaginationResponse<Notification> getNotifications(String email, int pageNo, int pageSize);
    void updateNotifications(List<Long> ids);
}
