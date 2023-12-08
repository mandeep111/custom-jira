package com.laconic.pcms.utils;

import com.laconic.pcms.entity.Notification;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.enums.NotificationType;
import com.laconic.pcms.event.NotificationEvent;
import com.laconic.pcms.repository.INotificationRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.laconic.pcms.constants.AppMessages.EMAIL_BODY;
import static com.laconic.pcms.constants.AppMessages.EMAIL_SUBJECT;

@Component
public class NotificationUtil {
    @Value("${pms.ui.url}")
    private String BASE_UI_URL;
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    private final INotificationRepo notificationRepo;

    public NotificationUtil(INotificationRepo notifications) {
        this.notificationRepo = notifications;
    }

    @Transactional
    public void sendEmails(Set<User> users, NotificationType type,String name, String url) {
        List<Notification> notifications = new ArrayList<>();
        users.forEach(u -> {
            var notification = Notification.builder()
                    .recipient(u.getEmail())
                    .subject(String.format(EMAIL_SUBJECT, type.name()))
                    .isRead(false)
                    .isSent(false)
                    .body(String.format(EMAIL_BODY,u.getFullName(), type.name()))
                    .url(BASE_UI_URL + "/" + url)
                    .build();
            notifications.add(notification);
        });
        this.notificationRepo.saveAll(notifications);
        eventPublisher.publishEvent(new NotificationEvent(notifications));
    }
}
