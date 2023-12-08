package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface INotificationRepo extends JpaRepository<Notification, Long> {
    Page<Notification> findAllByRecipient(String email, PageRequest pageable);
}
