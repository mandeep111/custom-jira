package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.TagRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TagResponse;
import com.laconic.pcms.service.concrete.ITagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Routes.tag)
@RequiredArgsConstructor
public class TagController {

    private final ITagService projectTagService;

    @PostMapping
    public void save(@RequestBody @Valid TagRequest request) {
        try {
            this.projectTagService.save(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid TagRequest request, @PathVariable Long id) {
        try {
            this.projectTagService.update(request, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<PaginationResponse<TagResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                  @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                  @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                  @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                  @RequestParam(value = "search", required = false) String keyword) {
        return ResponseEntity.ok(this.projectTagService.getAll(pageNo, pageSize, keyword));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<TagResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.projectTagService.getById(id));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.projectTagService.delete(id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }
}
