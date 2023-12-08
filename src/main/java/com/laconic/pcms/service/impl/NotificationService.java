package com.laconic.pcms.service.impl;

import com.laconic.pcms.entity.Notification;
import com.laconic.pcms.repository.INotificationRepo;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.INotificationService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService implements INotificationService {

    private final INotificationRepo notificationRepo;

    public NotificationService(INotificationRepo notificationRepo) {
        this.notificationRepo = notificationRepo;
    }

    @Override
    public PaginationResponse<Notification> getNotifications(String email, int pageNo, int pageSize) {
        var pageable = PageRequest.of(pageNo, pageSize, Sort.by("creationDate").descending());
        var page = this.notificationRepo.findAllByRecipient(email, pageable);
        var count = page.stream().filter(e->!e.getIsRead()).count(); // unread emails
        return new PaginationResponse<>(page.getContent(),
                page.getNumber(), page.getSize(), count, page.getTotalPages(), page.isLast());
    }

    @Override
    public void updateNotifications(List<Long> ids) {
        var notifications = this.notificationRepo.findAllById(ids);
        notifications.forEach(n -> n.setIsRead(true));
        this.notificationRepo.saveAll(notifications);

    }
}
