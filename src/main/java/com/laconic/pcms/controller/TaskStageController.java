package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.TaskTypeRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TaskStageResponse;
import com.laconic.pcms.service.concrete.ITaskStageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Routes.task_stage)
@RequiredArgsConstructor
public class TaskStageController {

    private final ITaskStageService taskTypeService;

    @PostMapping
    public void save(@RequestBody @Valid TaskTypeRequest request) {
        try {
            this.taskTypeService.save(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid TaskTypeRequest request, @PathVariable Long id) {
        try {
            this.taskTypeService.update(request, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }


    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<TaskStageResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                        @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                        @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                        @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                        @RequestParam(value = "search", required = false) String keyword,
                                                                        @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {
        return ResponseEntity.ok(this.taskTypeService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<TaskStageResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.taskTypeService.getById(id));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.taskTypeService.delete(id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }
}
