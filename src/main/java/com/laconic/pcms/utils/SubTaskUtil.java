package com.laconic.pcms.utils;

import com.laconic.pcms.entity.SubTask;
import com.laconic.pcms.exceptions.PreconditionFailedException;

public class SubTaskUtil {
    public static void checkBlocked(SubTask subTask) {
        if (subTask.getIsBlocked()) {
            throw new PreconditionFailedException("Subtask is blocked");
        }
    }

    public static void checkPermission(SubTask subTask, String currentUserEmail) {
        if (!subTask.getUser().getEmail().equals(currentUserEmail)) {
            throw new PreconditionFailedException("Subtask is not assigned to the user. " + currentUserEmail);
        }
    }

    public static void checkBlockedBy(SubTask subTask) {
        if (subTask.getBlockedBy() == null) {
            throw new PreconditionFailedException("Blocked by can not be null");
        }
    }
}
