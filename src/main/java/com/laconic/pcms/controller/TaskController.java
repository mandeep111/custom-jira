package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.dto.ChangePriorityDto;
import com.laconic.pcms.enums.TaskPriority;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.GroupByRequest;
import com.laconic.pcms.request.TaskRequest;
import com.laconic.pcms.response.GroupByResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.service.concrete.ITaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.laconic.pcms.component.KeyCloakComponent.getEmailFromToken;

@RestController
@RequestMapping(Routes.task)
@RequiredArgsConstructor
public class TaskController {

    private final ITaskService projectTaskService;

    @PostMapping
    public void save(@RequestBody @Valid TaskRequest request) {
        try {
            this.projectTaskService.save(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid TaskRequest request, @PathVariable Long id) {
        try {
            this.projectTaskService.update(request, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }


    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<TaskResponse>> getAll(@AuthenticationPrincipal Jwt jwt, @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                   @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                   @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                   @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                   @RequestParam(value = "search", required = false) String keyword,
                                                                   @RequestParam(value = "projectId", required = false) Long projectId,
                                                                   @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {
        return ResponseEntity.ok().body(this.projectTaskService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes, projectId, getEmailFromToken(jwt.getTokenValue())));
    }

    @GetMapping(Routes.list)
    public ResponseEntity<List<TaskResponse>> getAll(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok().body(this.projectTaskService.getAll(getEmailFromToken(jwt.getTokenValue())));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<TaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok().body(this.projectTaskService.getById(id));
    }

    @GetMapping("/find-by-project/{projectId}")
    public ResponseEntity<List<TaskResponse>> getByProject(@AuthenticationPrincipal Jwt jwt, @PathVariable Long projectId) {
        return ResponseEntity.ok().body(this.projectTaskService.getTaskByProject(projectId, getEmailFromToken(jwt.getTokenValue())));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.projectTaskService.delete(id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PatchMapping("/change/{id}/{taskTypeId}")
    public void changeTaskType(@PathVariable Long id, @PathVariable Long taskTypeId) {
        try {
            this.projectTaskService.changeStatus(id, taskTypeId);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping("/add-tag/{taskId}/{tagId}")
    public ResponseEntity<TaskResponse> addTag(@PathVariable Long taskId, @PathVariable Long tagId) {
        return ResponseEntity.ok().body(this.projectTaskService.addTag(taskId, tagId));
    }

    @DeleteMapping("/remove-tag/{taskId}/{tagId}")
    public ResponseEntity<TaskResponse> removeTag(@PathVariable Long taskId, @PathVariable Long tagId) {
        return ResponseEntity.ok().body(this.projectTaskService.removeTag(taskId, tagId));
    }

    @GetMapping("/enable/{id}")
    public void enable(@PathVariable Long id) {
        this.projectTaskService.enable(id);
    }

    @PostMapping("/assignee/{id}/{assigneeId}")
    public ResponseEntity<TaskResponse> addAssignee(@PathVariable("id") Long id, @PathVariable("assigneeId") Long assigneeId) {
        return ResponseEntity.ok().body(this.projectTaskService.addAssignee(id, assigneeId));
    }

    @DeleteMapping("/assignee/{id}/{assigneeId}")
    public ResponseEntity<TaskResponse> removeAssignee(@PathVariable("id") Long id, @PathVariable("assigneeId") Long assigneeId) {
        return ResponseEntity.ok().body(this.projectTaskService.removeAssignee(id, assigneeId));
    }

    @PostMapping("/duplicate/{id}")
    public ResponseEntity<TaskResponse> duplicate(@PathVariable Long id) {
        return ResponseEntity.ok().body(this.projectTaskService.duplicateTask(id));
    }

    @PatchMapping("/change-priority/{id}")
    public void changePriority(@PathVariable Long id, @RequestBody ChangePriorityDto record) {
        this.projectTaskService.changePriority(id, TaskPriority.valueOf(record.priority()));
    }

    @PostMapping("/group-by")
    public ResponseEntity<List<GroupByResponse>> groupTasks(@AuthenticationPrincipal Jwt jwt, @RequestBody GroupByRequest request) {
        return ResponseEntity.ok().body(this.projectTaskService.getGroupedTasks(getEmailFromToken(jwt.getTokenValue()), request));
    }

    @PostMapping("/resolve-subtask/{taskId}")
    public ResponseEntity<TaskResponse> resolveAllSubtasks(@PathVariable("taskId") Long taskId) {
        return ResponseEntity.ok().body(this.projectTaskService.resolveSubTasks(taskId));
    }
}
