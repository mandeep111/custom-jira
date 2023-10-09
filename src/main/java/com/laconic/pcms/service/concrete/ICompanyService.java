package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.CompanyRequest;
import com.laconic.pcms.response.CompanyResponse;
import com.laconic.pcms.response.PaginationResponse;

import java.util.List;

public interface ICompanyService {
    void save(CompanyRequest company);
    void update(CompanyRequest company, Long id);
    CompanyResponse getById(Long id);
    PaginationResponse<CompanyResponse> list(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);

    void delete(Long id);
}
