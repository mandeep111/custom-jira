package com.laconic.pcms.constants;

public abstract class Routes {
    // basic operations
    public final static String getById = "/{id}";
    public final static String delete = "/{id}";
    public final static String list = "/all";
    public final static String page = "/page";
    public final static String update = "/{id}";

    // controllers
    public final static String company = "/v1/company";
    public final static String user = "/v1/user";
    public final static String customer = "/v1/customer";
    public final static String mail_template = "/v1/mail-template";
    public final static String milestone = "/v1/milestone";
    public final static String project = "/v1/project";
    public final static String tag = "/v1/tag";
    public final static String stage = "/v1/stage";
    public final static String task = "/v1/task";
    public final static String project_update = "/v1/project-update";
    public final static String task_stage = "/v1/task-stage";
    public final static String space = "/v1/space";
}
