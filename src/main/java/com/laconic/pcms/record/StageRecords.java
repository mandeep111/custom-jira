package com.laconic.pcms.record;

public class StageRecords {
    public interface S {
        Long getId();
        String getName();
        Boolean getIsFold();
    }

    public interface Stage {
        Long getStage_Id();
        String getStage_Name();
        Boolean getStage_IsFold();
    }

    public interface Stages {
        Long getStages_Id();
        String getStages_Name();
        Boolean getStages_IsFold();
    }
}
