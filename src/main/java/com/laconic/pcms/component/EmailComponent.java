package com.laconic.pcms.component;


import com.laconic.pcms.event.MilestoneEvent;
import com.laconic.pcms.event.NotificationEvent;
import com.laconic.pcms.repository.INotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class EmailComponent {

    @Autowired
    private JavaMailSender javaMailSender;
    private final INotificationRepo notificationRepo;

    public EmailComponent(INotificationRepo notificationRepo) {
        this.notificationRepo = notificationRepo;
    }


    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        var notifications = event.notification();
        // send the email in one thread
        Thread emailThread = new Thread(() -> notifications.forEach(notification -> {
            try {
                sendMessage(notification.getRecipient(), notification.getSubject(), notification.getBody() + "\nPlease check." + notification.getUrl());
                notification.setIsSent(true);
                this.notificationRepo.saveAndFlush(notification);
                System.out.println("Sent email to " + notification.getRecipient());
            } catch (Exception e) {
                System.err.println("Error sending email: " + e.getMessage());
            }
        }));
        emailThread.start();
    }

    @EventListener
    public void handleMilestoneEvent(MilestoneEvent event) {
        try {
            sendMessage(event.to(), event.subject(), event.body());
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    private void sendMessage(String event, String event1, String event2) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(event);
        message.setSubject(event1);
        message.setText(event2);
        javaMailSender.send(message);
        System.out.println("Message Sent");
    }


}
