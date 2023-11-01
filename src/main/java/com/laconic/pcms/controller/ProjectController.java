package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.ChangeManagerRequest;
import com.laconic.pcms.request.ProjectReportRequest;
import com.laconic.pcms.request.ProjectRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.service.concrete.IFavoriteProjectService;
import com.laconic.pcms.service.concrete.IProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.laconic.pcms.component.KeyCloakComponent.getEmailFromToken;
import static com.laconic.pcms.constants.AppMessages.SOMETHING_WENT_WRONG;

@RestController
@RequestMapping(Routes.project)
@RequiredArgsConstructor
public class ProjectController {

    private final IProjectService projectService;
    private final IFavoriteProjectService favoriteProjectService;

    @PostMapping
    public void save(@RequestBody @Valid ProjectRequest request) {
        try {
            this.projectService.save(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid ProjectRequest request, @PathVariable Long id) {
        try {
            this.projectService.update(request, id);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }


    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<ProjectResponse>> getAll(@AuthenticationPrincipal Jwt jwt, @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                      @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                      @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                      @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                      @RequestParam(value = "search", required = false) String keyword,
                                                                      @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {
        return ResponseEntity.ok(this.projectService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes, getEmailFromToken(jwt.getTokenValue())));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProjectResponse>> getAll(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(this.projectService.getAll(jwt.getTokenValue()));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<ProjectResponse> getById(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return ResponseEntity.ok(this.projectService.getById(id, getEmailFromToken(jwt.getTokenValue())));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.projectService.delete(id);
        } catch (Exception e) {
            throw new ServerException(SOMETHING_WENT_WRONG);
        }
    }

    @GetMapping("/change/{id}/{stageId}")
    public void changeStage(@PathVariable Long id, @PathVariable Long stageId) {
        try {
            this.projectService.changeStage(id, stageId);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @DeleteMapping("/remove-task/{projectId}/{taskId}")
    public void removeTask(@PathVariable Long projectId, @PathVariable Long taskId) {
        try {
            this.projectService.removeTask(projectId, taskId);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PostMapping("/change-manager")
    public void changeManager(@RequestBody ChangeManagerRequest request) {
        try {
            this.projectService.changeManager(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping("/change-visibility/{id}")
    public void changeVisibility(@PathVariable Long id, @RequestParam Boolean isPrivate) {
        this.projectService.changeVisibility(id, isPrivate);
    }

    @GetMapping("/enable/{id}")
    public void enable(@PathVariable Long id) {
        this.projectService.enable(id);
    }

    @PostMapping("/duplicate/{id}")
    public ResponseEntity<ProjectResponse> duplicate(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(this.projectService.duplicate(id));
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping("/name/{id}")
    public ResponseEntity<ProjectResponse> changeName(@PathVariable Long id, @RequestParam(value = "name") String name) {
        return ResponseEntity.ok().body(this.projectService.updateName(name, id));
    }

    @PutMapping("/color/{id}")
    public ResponseEntity<ProjectResponse> changeColor(@PathVariable Long id, @RequestParam(value = "color") String color) {
        return ResponseEntity.ok().body(this.projectService.updateColor(color, id));
    }

    @PatchMapping("/move-to-space/{id}/{spaceId}")
    public ResponseEntity<ProjectResponse> moveToSpace(@PathVariable Long id, @PathVariable Long spaceId) {
        return ResponseEntity.ok().body(this.projectService.moveToSpace(id, spaceId));
    }

    @PatchMapping("/move-to-folder/{id}/{spaceId}/{folderId}")
    public ResponseEntity<ProjectResponse> moveToFolder(@PathVariable Long id, @PathVariable Long spaceId, @PathVariable Long folderId) {
        return ResponseEntity.ok().body(this.projectService.moveToFolder(id, spaceId, folderId));
    }

    @PatchMapping("/move-out-folder/{id}")
    public ResponseEntity<ProjectResponse> moveOutOfFolder(@PathVariable Long id) {
        return ResponseEntity.ok().body(this.projectService.moveOutOfFolder(id));
    }

    @PostMapping("/report")
    public ResponseEntity<List<ProjectResponse>> getReport(@RequestBody ProjectReportRequest request) {
        return ResponseEntity.ok(this.projectService.getProjectReportByCompany(request));
    }

    @PostMapping("/favorite/{projectId}")
    public void makeFavorite(@PathVariable Long projectId) {
        this.favoriteProjectService.addToFavorite(projectId);
    }

    @DeleteMapping("/remove-favorite/{projectId}")
    public void removeFavorite(@PathVariable Long projectId) {
        this.favoriteProjectService.removeFromFavorite(projectId);
    }

}
