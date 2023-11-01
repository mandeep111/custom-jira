package com.laconic.pcms.record;

import com.laconic.pcms.enums.ProgressStatus;

import java.util.Date;

public class ProjectRecords {
    public interface P {
        Long getId();
        String getColor();
        String getName();
        String getLabel();
        String getDescription();
        Boolean getIsRecurringAllowed();
        String getLastUpdateStatus();
        Long getLastUpdateId();
        Date getDeadlineDate();
        Date getStartDate();
        String getAllocatedHours();
        String getUrl();
        Boolean getIsPrivate();
        ProgressStatus getStatus();
    }
    public interface Project {
        Long getProject_Id();
        String getProject_Color();
        String getProject_Name();
        String getProject_Label();
        String getProject_Description();
        Boolean getProject_IsRecurringAllowed();
        String getProject_LastUpdateStatus();
        Long getProject_LastUpdateId();
        Date getProject_DeadlineDate();
        Date getProject_StartDate();
        String getProject_AllocatedHours();
        String getProject_Url();
        Boolean getProject_IsPrivate();
        ProgressStatus getProject_Status();
    }

    public interface Projects {
        Long getProjects_Id();
        String getProjects_Name();
        String getProjects_Color();
        String getProjects_Label();
        String getProjects_Description();
        Boolean getProjects_IsRecurringAllowed();
        String getProjects_LastUpdateStatus();
        Long getProjects_LastUpdateId();
        Date getProjects_DeadlineDate();
        Date getProjects_StartDate();
        String getProjects_AllocatedHours();
        String getProjects_Url();
        Boolean getProjects_IsPrivate();
        ProgressStatus getProjects_Status();
    }
}
