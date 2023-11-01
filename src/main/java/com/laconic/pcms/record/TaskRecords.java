package com.laconic.pcms.record;

import java.util.Date;

public class TaskRecords {
    public interface T {
        Long getId();
        String getColor();
        String getName();
        String getDescription();
        String getPriority();
        Date getDeadlineDate();
        Date getAssignedDate();
        Boolean getIsBlocked();
        Boolean getIsClosed();
        String getType();
    }

    public interface Task {
        Long getTask_Id();
        String getTask_Color();
        String getTask_Name();
        String getTask_Description();
        String getTask_Priority();
        Date getTask_DeadlineDate();
        Date getTask_AssignedDate();
        Boolean getTask_IsBlocked();
        Boolean getTask_IsClosed();
        String getTask_Type();
    }

    public interface Tasks {
        Long getTasks_Id();
        String getTasks_Color();
        String getTasks_Name();
        String getTasks_Description();
        String getTasks_Priority();
        Date getTasks_DeadlineDate();
        Date getTasks_AssignedDate();
        Boolean getTasks_IsBlocked();
        Boolean getTasks_IsClosed();
        String getTasks_Type();
    }
}
