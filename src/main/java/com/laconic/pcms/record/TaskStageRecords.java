package com.laconic.pcms.record;

public class TaskStageRecords {
    public interface TS {
        Long getId();
        Long getName();
        Long getDescription();
        Boolean getIsFold();
        String getColor();
    }

    public interface TaskStage {
        Long getTaskStage_Id();
        Long getTaskStage_Name();
        Long getTaskStage_Description();
        Boolean getTaskStage_IsFold();
        String getTaskStage_Color();
    }


    public interface TaskStages {
        Long getTaskStages_Id();
        Long getTaskStages_Name();
        Long getTaskStages_Description();
        Boolean getTaskStages_IsFold();
        String getTaskStages_Color();
    }
}
