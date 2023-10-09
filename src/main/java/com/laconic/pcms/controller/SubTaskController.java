package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.request.ChangeAssigneeRequest;
import com.laconic.pcms.request.SubTaskRequest;
import com.laconic.pcms.request.TaskRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SubTaskResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.service.concrete.ISubTaskService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Routes.sub_task)
public class SubTaskController {

    private final ISubTaskService subTaskService;

    public SubTaskController(ISubTaskService subTaskService) {
        this.subTaskService = subTaskService;
    }

    @PostMapping
    public ResponseEntity<SubTaskResponse> save(@RequestBody @Valid SubTaskRequest request) {
        return ResponseEntity.ok().body(this.subTaskService.save(request));
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid SubTaskRequest request, @PathVariable Long id) {
        this.subTaskService.update(request, id);
    }

    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<SubTaskResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                      @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                      @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                      @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                      @RequestParam(value = "search", required = false) String keyword,
                                                                      @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {
        return ResponseEntity.ok().body(this.subTaskService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes));
    }

    @GetMapping(Routes.list)
    public ResponseEntity<List<SubTaskResponse>> getAll() {
        return ResponseEntity.ok().body(this.subTaskService.getAll());
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<SubTaskResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok().body(this.subTaskService.getById(id));
    }

    @PostMapping("/change-assignee")
    public void changeAssignee(@RequestBody @Valid ChangeAssigneeRequest request) {
        this.subTaskService.changeAssignee(request.subTaskId(), request.userId());
    }

    public record ChangeStatusRecord(Long id, String status) {}

    @PostMapping("/change-status")
    public void changeStatus(@RequestBody ChangeStatusRecord record) {
        this.subTaskService.changeStatus(record.id, ProgressStatus.valueOf(record.status));
    }

}
