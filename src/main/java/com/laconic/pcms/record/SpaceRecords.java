package com.laconic.pcms.record;

public class SpaceRecords {
    public interface S {
        Long getId();
        String getName();
        String getTags();
        String getColor();
        String getUrl();
        Boolean getIsOpen();
        Boolean getIsPrivate();
        String getDescription();
    }

    public interface Space {
        Long getSpace_Id();
        String getSpace_Name();
        String getSpace_Tags();
        String getSpace_Color();
        String getSpace_Url();
        Boolean getSpace_IsOpen();
        Boolean getSpace_IsPrivate();
        String getSpace_Description();
    }

    public interface Spaces {
        Long getSpaces_Id();
        String getSpaces_Name();
        String getSpaces_Tags();
        String getSpaces_Color();
        String getSpaces_Url();
        Boolean getSpaces_IsOpen();
        Boolean getSpaces_IsPrivate();
        String getSpaces_Description();
    }
}
