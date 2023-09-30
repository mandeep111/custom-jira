package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.Company;
import com.laconic.pcms.repository.ICompanyRepo;
import com.laconic.pcms.request.CompanyRequest;
import com.laconic.pcms.response.CompanyResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.ICompanyService;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.COMPANY;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class CompanyService implements ICompanyService {
    private final ICompanyRepo companyRepo;
    private final CommonComponent commonComponent;

    public CompanyService(ICompanyRepo companyRepo, CommonComponent commonComponent) {
        this.companyRepo = companyRepo;
        this.commonComponent = commonComponent;
    }

    @Override
    public void save(CompanyRequest request) {
        var company = convertObject(request, Company.class);
        this.companyRepo.save(company);
    }

    @Override
    public void update(CompanyRequest request, Long id) {
        var company = getCompany(id);
        company.setName(request.getName());
        company.setActive(request.getIsActive());
        this.companyRepo.save(company);
    }

    @Override
    public CompanyResponse getById(Long id) {
        Company result = getCompany(id);
        return convertObject(result, CompanyResponse.class);
    }

    private Company getCompany(Long id) {
        return this.companyRepo.findById(id).orElseThrow(throwNotFoundException(id, COMPANY));
    }

    @Override
    public PaginationResponse<CompanyResponse> list(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var page = commonComponent.findAllEntities(Company.class, COMPANY, keyword, searchAttributes, pageable);
        return getPaginationResponse(page, CompanyResponse.class);
    }

    @Override
    public void delete(Long id) {
        Company company = getCompany(id);
        company.setActive(false);
        this.companyRepo.save(company);
    }


/*    @Override
    public PaginationResponse<CompanyResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var page = commonComponent.findAllEntities(Company.class, COMPANY, keyword, BY_NAME, pageable);
        return getPaginationResponse(page, autoMapper.convertList(page.getContent(), CompanyResponse.class));
    }

    @Override
    public List<CompanyResponse> getAll() {
        return autoMapper.convertList(commonComponent.findAllEntities(Company.class, COMPANY), CompanyResponse.class);
    }*/
}
