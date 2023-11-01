package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.MailTemplateRequest;
import com.laconic.pcms.response.MailTemplateResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.IMailTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(Routes.mail_template)
@RequiredArgsConstructor
public class MailTemplateController {

    private final IMailTemplateService mailTemplateService;
    @PostMapping
    public void save(@RequestBody MailTemplateRequest mailTemplateRequest) {
        try {
            this.mailTemplateService.save(mailTemplateRequest);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid MailTemplateRequest mailTemplateRequest, @PathVariable Long id) {
        try {
            this.mailTemplateService.update(mailTemplateRequest, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<MailTemplateResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                           @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                           @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                           @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                           @RequestParam(value = "search", required = false) String keyword,
                                                                           @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {
        return ResponseEntity.ok(this.mailTemplateService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<MailTemplateResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.mailTemplateService.getById(id));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.mailTemplateService.delete(id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }
}
