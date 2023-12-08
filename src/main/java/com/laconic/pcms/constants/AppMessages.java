package com.laconic.pcms.constants;

public abstract class AppMessages {
    public final static String CUSTOMER = "CUSTOMER";
    public final static String USER = "USER";
    public final static String SPACE = "SPACE";
    public final static String FOLDER = "FOLDER";
    public final static String COMPANY = "COMPANY";
    public final static String MAIL_TEMPLATE = "MAIL TEMPLATE";
    public final static String MILESTONE = "MILESTONE";
    public final static String PROJECT = "PROJECT";
    public final static String TAG = "PROJECT TAG";
    public final static String TASK = "PROJECT TASK";
    public final static String SUB_TASK = "SUB TASK";
    public final static String STAGE = "PROJECT STAGE";
    public final static String UPDATE = "PROJECT UPDATE";
    public final static String TASK_TYPE = "TASK TYPE";

    // exception messages
    public static final String SOMETHING_WENT_WRONG = "Something went wrong";
    public final static String NOT_FOUND_FORMAT = "[%s] NOT FOUND WITH %s [%s]";
    public final static String NOT_FOUND_WITH_ID_FORMAT = "[%s] NOT FOUND WITH [%s]";
    public final static String NOT_FOUND_WITH_PARENT_FORMAT = "[%s] NOT FOUND FOR [%s] WITH [%s]";
    public final static String NOT_FOUND_WITH_ID_AND_PARENT_FORMAT = "[%s] NOT FOUND WITH [%s] ID [%s] AND [%s] ID [%s]";
    public static final String DATA_DELETED = "[%s] DELETED SUCCESSFULLY WITH ID [%s].";

    // not present
    public static final String USER_NOT_PRESENT = "User is not present in this %s";

    // notification messages
    public static final String EMAIL_BODY = "Dear %s, \nA new [%s] is assigned to you."; // provide full name, task or subtask or project or space name
    public static final String EMAIL_SUBJECT = "New %s Alert";
}
