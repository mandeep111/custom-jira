package com.laconic.pcms.event;

import com.laconic.pcms.entity.Notification;

import java.util.List;

public record NotificationEvent(List<Notification> notification) {}
