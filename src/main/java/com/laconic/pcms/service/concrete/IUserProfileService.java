package com.laconic.pcms.service.concrete;

import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.response.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IUserProfileService {
    List<TaskResponse> getMyTasks();
    List<ProjectResponse> getMyProjects();
    List<ProjectResponse> getMyFavoriteProjects();
    List<SpaceResponse> getMyFavoriteSpaces();
    List<SubTaskResponse> getMySubTasks();
    PaginationResponse<SpaceResponse> getMyFavoriteSpaces(int pageNo, int pageSize, String sortBy, String sortDir);
    PaginationResponse<ProjectResponse> getMyFavoriteProjects(int pageNo, int pageSize, String sortBy, String sortDir);
    PaginationResponse<TaskResponse> getMyTasks(int pageNo, int pageSize, String sortBy, String sortDir);
    PaginationResponse<SubTaskResponse> getMySubTasks(int pageNo, int pageSize, String sortBy, String sortDir);
    Map<String, Integer> getProfileCounts();
    Map<UserResponse, Map<String, Long>> getUserWorkload(Long spaceId, Date startDate, Date endDate);
    List<Map<UserResponse, Map<String, Long>>> getUserWorkloads(Date startDate, Date endDate);
    Map<UserResponse, Map<ProgressStatus, Long>> getUserSubTasksByProject(Long projectId, Date startDate, Date endDate);
    Map<UserResponse, Map<ProgressStatus, Long>> getUserSubTasksBySpace(Long spaceId, Date startDate, Date endDate);
    Map<UserResponse, Map<ProgressStatus, Long>> getAllSubTasks(Date startDate, Date endDate);

}
