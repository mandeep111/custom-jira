package com.laconic.pcms.controller;

import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.SubTaskResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.service.concrete.IUserProfileService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
