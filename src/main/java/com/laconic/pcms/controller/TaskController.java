package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.TaskRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.service.concrete.ITaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<PaginationResponse<TaskResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                   @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                   @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                   @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                   @RequestParam(value = "search", required = false) String keyword,
                                                                   @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {
        return ResponseEntity.ok().body(this.projectTaskService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<TaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok().body(this.projectTaskService.getById(id));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.projectTaskService.delete(id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping("/change/{id}/{taskTypeId}")
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

    @GetMapping("/add-assignee/{taskId}/{assigneeId}")
    public ResponseEntity<TaskResponse> addAssignee(@PathVariable Long taskId, @PathVariable Long assigneeId) {
        return ResponseEntity.ok().body(this.projectTaskService.addAssignee(taskId, assigneeId));
    }

    @DeleteMapping("/remove-assignee/{taskId}/{assigneeId}")
    public ResponseEntity<TaskResponse> removeAssignee(@PathVariable Long taskId, @PathVariable Long assigneeId) {
        return ResponseEntity.ok().body(this.projectTaskService.removeAssignee(taskId, assigneeId));
    }
}
