package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.response.*;
import com.laconic.pcms.service.concrete.IUserProfileService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(Routes.user_profile)
public class UserProfileController {

    private final IUserProfileService userProfileService;

    public UserProfileController(IUserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public Map<String, Integer> getProfileCounts() {
        return userProfileService.getProfileCounts();
    }

    @GetMapping("/workload/{spaceId}")
    public Map<UserResponse, Map<String, Long>> getWorkloadBySpace(@RequestParam("startDate") Date startDate,
                                                                   @RequestParam("endDate") Date endDate,
                                                                   @PathVariable("spaceId") Long spaceId) {
        return userProfileService.getUserWorkload(spaceId, startDate, endDate);
    }

    @GetMapping("/workload")
    public List<Map<UserResponse, Map<String, Long>>> getUserSubTasksByProject(@RequestParam("startDate") Date startDate,
                                                                               @RequestParam("endDate") Date endDate) {
        return userProfileService.getUserWorkloads(startDate, endDate);
    }

    @GetMapping("/space-sub-task/{spaceId}")
    public Map<UserResponse, Map<ProgressStatus, Long>> getSubTasksBySpace(@RequestParam("startDate") Date startDate,
                                                                           @RequestParam("endDate") Date endDate,
                                                                           @PathVariable("spaceId") Long spaceId) {
        return userProfileService.getUserSubTasksBySpace(spaceId, startDate, endDate);
    }

    @GetMapping("/project-sub-task/{projectId}")
    public Map<UserResponse, Map<ProgressStatus, Long>> getSubTasksByProject(@RequestParam("startDate") Date startDate,
                                                                             @RequestParam("endDate") Date endDate,
                                                                             @PathVariable("projectId") Long projectId) {
        return userProfileService.getUserSubTasksByProject(projectId, startDate, endDate);
    }

    @GetMapping("/sub-count")
    public Map<UserResponse, Map<ProgressStatus, Long>> getAllSubTasks(@RequestParam("startDate") Date startDate,
                                                                       @RequestParam("endDate") Date endDate) {
        return userProfileService.getAllSubTasks(startDate, endDate);
    }


    @GetMapping("/my-tasks")
    public ResponseEntity<List<TaskResponse>> getMyTasks() {
        return ResponseEntity.ok().body(this.userProfileService.getMyTasks());
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        return ResponseEntity.ok().body(this.userProfileService.getMyProjects());
    }

    @GetMapping("/my-sub-tasks")
    public ResponseEntity<List<SubTaskResponse>> getMySubTasks() {
        return ResponseEntity.ok().body(this.userProfileService.getMySubTasks());
    }

    @GetMapping("/my-fav-projects")
    public ResponseEntity<List<ProjectResponse>> getMyFavoriteProjects() {
        return ResponseEntity.ok().body(this.userProfileService.getMyFavoriteProjects());
    }

    @GetMapping("/favorite/space")
    public ResponseEntity<List<SpaceResponse>> getMyFavoriteSpaces() {
        return ResponseEntity.ok().body(this.userProfileService.getMyFavoriteSpaces());
    }

    // todo: create pagination controller

    @GetMapping("/my-sub-tasks/page")
    public ResponseEntity<PaginationResponse<SubTaskResponse>> getMySubTasks(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                             @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                             @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                             @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir) {
        return ResponseEntity.ok().body(this.userProfileService.getMySubTasks(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/my-fav-projects/page")
    public ResponseEntity<PaginationResponse<ProjectResponse>> getMyFavoriteProjects(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                                     @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                                     @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                                     @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir) {
        return ResponseEntity.ok().body(this.userProfileService.getMyFavoriteProjects(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/my-fav-spaces/page")
    public ResponseEntity<PaginationResponse<SpaceResponse>> getMyFavoriteSpaces(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                                 @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                                 @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                                 @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir) {
        return ResponseEntity.ok().body(this.userProfileService.getMyFavoriteSpaces(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/my-tasks/page")
    public ResponseEntity<PaginationResponse<TaskResponse>> getMyTasks(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                       @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                       @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                       @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir) {
        return ResponseEntity.ok().body(this.userProfileService.getMyTasks(pageNo, pageSize, sortBy, sortDir));
    }
}
