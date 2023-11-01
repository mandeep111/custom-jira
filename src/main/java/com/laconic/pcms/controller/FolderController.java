package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.FolderRequest;
import com.laconic.pcms.response.*;
import com.laconic.pcms.service.concrete.IFolderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.SOMETHING_WENT_WRONG;

@RestController
@RequestMapping(Routes.folder)
public class FolderController {
    private final IFolderService folderService;

    public FolderController(IFolderService folderService) {
        this.folderService = folderService;
    }

    @PostMapping
    public void save(@RequestBody FolderRequest request) {
        try {
            this.folderService.save(request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping("/name/{id}")
    public ResponseEntity<FolderResponse> changeName(@PathVariable Long id, @RequestParam(value = "name") String name) {
        return ResponseEntity.ok().body(this.folderService.rename(id, name));
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody FolderRequest request, @PathVariable Long id) {
        try {
            this.folderService.update(request, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PatchMapping("/move-to-space/{id}/{spaceId}")
    public ResponseEntity<FolderResponse> moveFolder(@PathVariable Long id, @PathVariable Long spaceId) {
        return ResponseEntity.ok().body(this.folderService.moveFolder(id, spaceId));
    }

    @DeleteMapping("/{id}")
    public void disable(@PathVariable Long id) {
        try {
            this.folderService.delete(id);
        } catch (Exception e) {
            throw new ServerException(SOMETHING_WENT_WRONG);
        }
    }

    @GetMapping("/page")
    public ResponseEntity<PaginationResponse<FolderResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                     @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                     @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                     @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                     @RequestParam(value = "spaceId", required = false) Long spaceId,
                                                                     @RequestParam(value = "search", required = false) String keyword) {
        return ResponseEntity.ok(this.folderService.getAll(pageNo, pageSize, sortBy, sortDir, spaceId, keyword));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<FolderResponse> getFolder(@PathVariable Long id) {
        return ResponseEntity.ok().body(this.folderService.getById(id));
    }
}
