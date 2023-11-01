package com.laconic.pcms.record;

public class UserRecords {
    public interface U {
        Long getId();
        String getEmail();
        String getFullName();
    }

    public interface User {
        Long getUser_Id();
        String getUser_Email();
        String getUser_FullName();
    }

    public interface Users {
        Long getUsers_Id();
        String getUsers_Email();
        String getUsers_FullName();
    }

}
