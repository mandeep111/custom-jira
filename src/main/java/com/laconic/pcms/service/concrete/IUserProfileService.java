package com.laconic.pcms.service.concrete;

import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.Task;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.SubTaskResponse;
import com.laconic.pcms.response.TaskResponse;

import java.util.List;
import java.util.Map;

public interface IUserProfileService {
    List<TaskResponse> getMyTasks(); // show with current status as key such as TO DO, DONE, COMPLETED
    List<ProjectResponse> getMyProjects();
    List<SubTaskResponse> getMySubTasks();
    Map<String, Integer> getProfileCounts();
}
