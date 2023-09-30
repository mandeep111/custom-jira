package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.MailTemplateRequest;
import com.laconic.pcms.response.MailTemplateResponse;
import com.laconic.pcms.response.PaginationResponse;

import java.util.List;

public interface IMailTemplateService {
    void save(MailTemplateRequest request);
    void update(MailTemplateRequest request, Long id);
    MailTemplateResponse getById(Long id);
    PaginationResponse<MailTemplateResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);
    List<MailTemplateResponse> getAll();

    void delete(Long id);
}
