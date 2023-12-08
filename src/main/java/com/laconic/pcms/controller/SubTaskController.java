package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.dto.ChangePriorityDto;
import com.laconic.pcms.dto.ChangeStatusDto;
import com.laconic.pcms.enums.ProgressStatus;
import com.laconic.pcms.enums.TaskPriority;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.SubTaskRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SubTaskResponse;
import com.laconic.pcms.response.TaskResponse;
import com.laconic.pcms.service.concrete.ISubTaskService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

import static com.laconic.pcms.component.KeyCloakComponent.getEmailFromToken;

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


    @GetMapping("/get-by-space")
    public ResponseEntity<List<SubTaskResponse>> getAllBySpace(@RequestParam("startDate") Date startDate,
                                                               @RequestParam("endDate") Date endDate,
                                                               @RequestParam(value = "spaceId", required = false) Long spaceId) {
        return ResponseEntity.ok().body(this.subTaskService.getAllBySpace(spaceId, startDate, endDate));
    }


    @GetMapping(Routes.getById)
    public ResponseEntity<SubTaskResponse> getById(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return ResponseEntity.ok().body(this.subTaskService.getById(jwt, id));
    }

    @PatchMapping("/change-assignee/{id}/{userId}")
    public ResponseEntity<SubTaskResponse> changeAssignee(@PathVariable Long id, @PathVariable Long userId) {
        return ResponseEntity.ok().body(this.subTaskService.changeAssignee(id, userId));
    }
//    public void changeAssignee(@PathVariable Long id, @PathVariable Long userId) {
//        this.subTaskService.changeAssignee(id, userId);
//    }


    @PatchMapping("/change-status/{id}")
    public void changeStatus(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id, @RequestBody ChangeStatusDto record) {
        this.subTaskService.changeStatus(getEmailFromToken(jwt.getTokenValue()), id, ProgressStatus.valueOf(record.status()));
        }

        @PatchMapping("/change-priority/{id}")
        public void changePriority (@PathVariable Long id, @RequestBody ChangePriorityDto record){
            this.subTaskService.changePriority(id, TaskPriority.valueOf(record.priority()));
        }

        @GetMapping("/duplicate/{id}")
        public ResponseEntity<SubTaskResponse> duplicate (@PathVariable("id") Long id){
            return ResponseEntity.ok().body(this.subTaskService.duplicate(id));
        }
    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.subTaskService.delete(id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    // jasper test
    /*@GetMapping("report/{format}")
    public ResponseEntity<Resource> getReport(@PathVariable String format) throws JRException, IOException {

        byte[] reportContent = jasperComponent.getReport(subTaskService.getAll(), format);
        ByteArrayResource resource = new ByteArrayResource(reportContent);

        // pdf
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(resource.contentLength())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("report." + format)
                                .build().toString())
                .body(resource);
    }*/

}
