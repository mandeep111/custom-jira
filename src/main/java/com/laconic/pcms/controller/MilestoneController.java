package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.MileStoneRequest;
import com.laconic.pcms.response.MileStoneResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.IMilestoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.laconic.pcms.constants.AppMessages.SOMETHING_WENT_WRONG;

@RestController
@RequestMapping(Routes.milestone)
@RequiredArgsConstructor
public class MilestoneController {
    private final IMilestoneService milestoneService;

    @PostMapping
    public void save(@RequestBody @Valid MileStoneRequest request) {
        try {
            this.milestoneService.save(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping
    public void update(@RequestBody @Valid MileStoneRequest request) {
        try {
            this.milestoneService.update(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<PaginationResponse<MileStoneResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                     @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                     @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                     @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                     @RequestParam(value = "search", required = false) String keyword) {
        return ResponseEntity.ok(this.milestoneService.getAll(pageNo, pageSize, keyword));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<MileStoneResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.milestoneService.getById(id));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.milestoneService.delete(id);
        } catch (Exception e) {
            throw new ServerException(SOMETHING_WENT_WRONG);
        }
    }

    @GetMapping("by-project/{projectId}")
    public ResponseEntity<PaginationResponse<MileStoneResponse>> getAllByProjectId(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                        @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                        @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                        @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                        @RequestParam(value = "search", required = false) String keyword,
                                                                                   @PathVariable("projectId") Long projectId) {
        return ResponseEntity.ok(this.milestoneService.getAllByProjectId(pageNo, pageSize, keyword, projectId));
    }

    @PutMapping("mark-as-reached/{projectId}/{id}")
    public void update(@PathVariable("projectId") Long projectId, @PathVariable("id") Long id) {
        try {
            this.milestoneService.markAsReached(projectId, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }
}
