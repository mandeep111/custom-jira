package com.laconic.pcms.controller;

import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.exceptions.ValidationException;
import com.laconic.pcms.request.CompanyRequest;
import com.laconic.pcms.response.CompanyResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.ICompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.SOMETHING_WENT_WRONG;

@RestController
@RequestMapping(Routes.company)
@RequiredArgsConstructor
public class CompanyController {

    private final ICompanyService companyService;

    @PostMapping
    public void save(@RequestBody @Valid CompanyRequest company) {
        try {
            this.companyService.save(company);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@RequestBody @Valid CompanyRequest company, @PathVariable Long id) {
        try {
            this.companyService.update(company, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }


    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<CompanyResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                      @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                      @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                      @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                      @RequestParam(value = "search", required = false) String keyword,
                                                                      @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {
        return ResponseEntity.ok(this.companyService.list(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<CompanyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.companyService.getById(id));
    }

    @DeleteMapping(Routes.delete)
    public void disable(@PathVariable Long id) {
        try {
            this.companyService.delete(id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }
}
