package com.laconic.pcms.record;

import java.util.Date;

public class SubTaskRecords {

    public interface ST {
        Long getId();
        String getName();
        String getDescription();
        Date getDeadlineDate();
        Date getAssignedDate();
        Boolean getIsBlocked();
        Boolean getIsClosed();
        String getType();
        String getColor();
        String getRequestCode();
        String getUrl();
        Long getFormId();
        Long getUser_Id();
    }

    public interface SubTask {
        Long getSubTask_Id();
        String getSubTask_Name();
        String getSubTask_Description();
        Date getSubTask_DeadlineDate();
        Date getSubTask_AssignedDate();
        Boolean getSubTask_IsBlocked();
        Boolean getSubTask_IsClosed();
        String getSubTask_Type();
        String getSubTask_Color();
        String getSubTask_RequestCode();
        String getSubTask_Url();
        Long getSubTask_FormId();

    }

    public interface SubTasks {
        Long getSubTasks_Id();
        String getSubTasks_Name();
        String getSubTasks_Description();
        Date getSubTasks_DeadlineDate();
        Date getSubTasks_AssignedDate();
        Boolean getSubTasks_IsBlocked();
        Boolean getSubTasks_IsClosed();
        String getSubTasks_Type();
        String getSubTasks_Color();
        String getSubTasks_RequestCode();
        String getSubTasks_Url();
        Long getSubTasks_FormId();
    }

    public interface WithTaskAndUser extends ST, UserRecords.User, TaskRecords.Task{}
}
