package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.entity.Space;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.SpaceRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SpaceResponse;
import com.laconic.pcms.response.UserResponse;
import com.laconic.pcms.service.concrete.ISpaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.laconic.pcms.constants.AppConstants.*;

@RestController
@RequestMapping(Routes.space)
@RequiredArgsConstructor
public class SpaceController {

    private final ISpaceService spaceService;
    @PostMapping
    public void save(@RequestBody @Valid SpaceRequest spaceRequest) {
        try {
            this.spaceService.save(spaceRequest);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid SpaceRequest spaceRequest, @PathVariable Long id) {
        try {
            this.spaceService.update(spaceRequest, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<SpaceResponse> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(this.spaceService.getById(id));
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<SpaceResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                    @RequestParam(value = "pageSize", defaultValue = DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                    @RequestParam(value = "sortBy", defaultValue = DEFAULT_SORT_BY, required = false) String sortBy,
                                                                    @RequestParam(value = "sortDir", defaultValue = DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                    @RequestParam(value = "search", required = false) String keyword,
                                                                    @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {

        return ResponseEntity.ok(this.spaceService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes));
    }

    @GetMapping(Routes.list)
    public ResponseEntity<List<SpaceResponse>> getAll() {
        return ResponseEntity.ok(this.spaceService.getAll());
    }

    @GetMapping("/url/{id}")
    public ResponseEntity<SpaceResponse> getByUrl(@PathVariable Long id, @RequestParam String url) {
        return ResponseEntity.ok(this.spaceService.getByUrl(id, url));
    }

    @PostMapping("/assignee/{spaceId}")
    public void addAssignee(@PathVariable Long spaceId, @RequestParam(value = "userIds") List<Long> userIds) {
        try {
            this.spaceService.addAssignee(spaceId, userIds);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @DeleteMapping("/remove-assignee/{spaceId}")
    public void removeAssignee(@PathVariable Long spaceId, @RequestParam(value = "userIds") List<Long> userIds) {
        try {
            this.spaceService.removeAssignee(spaceId, userIds);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @DeleteMapping("/remove-project/{spaceId}")
    public void removeProject(@PathVariable Long spaceId, @RequestParam(value = "projectIds") List<Long> projectIds) {
        try {
            this.spaceService.removeProjects(spaceId, projectIds);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }
}
