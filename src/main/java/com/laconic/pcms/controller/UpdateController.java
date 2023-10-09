package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.UpdateRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.UpdateResponse;
import com.laconic.pcms.service.concrete.IUpdateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Routes.project_update)
@RequiredArgsConstructor
public class UpdateController {

    private final IUpdateService projectUpdateService;

    @PostMapping
    public void save(@RequestBody @Valid UpdateRequest request) {
        try {
            this.projectUpdateService.save(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid UpdateRequest request, @PathVariable("id") Long id) {
        try {
            this.projectUpdateService.update(request, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<UpdateResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                     @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                     @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                     @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                     @RequestParam(value = "search", required = false) String keyword) {
        return ResponseEntity.ok(this.projectUpdateService.getAll(pageNo, pageSize, keyword));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<PaginationResponse<UpdateResponse>> getAllByProject(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                              @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                              @PathVariable Long projectId) {
        return ResponseEntity.ok(this.projectUpdateService.getAllByProject(pageNo, pageSize, projectId));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<UpdateResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.projectUpdateService.getById(id));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.projectUpdateService.delete(id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }
}
