package com.laconic.pcms.record;

public class TagRecords {
    public interface T {
        Long getId();
        String getName();
        String getDescription();
    }

    public interface Tags {
        Long getTags_Id();
        String getTags_Name();
        String getTags_Description();
    }

    public interface Tag {
        Long getTag_Id();
        String getTag_Name();
        String getTag_Description();
    }
}
