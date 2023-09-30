package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.Company;
import com.laconic.pcms.entity.Customer;
import com.laconic.pcms.repository.ICustomerRepo;
import com.laconic.pcms.request.CustomerRequest;
import com.laconic.pcms.response.CompanyResponse;
import com.laconic.pcms.response.CustomerResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.ICustomerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.COMPANY;
import static com.laconic.pcms.constants.AppMessages.CUSTOMER;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class CustomerService implements ICustomerService {

    private final ICustomerRepo customerRepo;
    private final CommonComponent commonComponent;
    public CustomerService(ICustomerRepo customerRepo, CommonComponent commonComponent) {
        this.customerRepo = customerRepo;
        this.commonComponent = commonComponent;
    }

    @Override
    public void save(CustomerRequest request) {
        var customer = convertObject(request, Customer.class);
        this.customerRepo.save(customer);
    }

    @Override
    public void update(CustomerRequest request, Long id) {
        var customer = getCustomer(id);
        customer.setName(request.getName());
        customer.setActive(request.getIsActive());
        this.customerRepo.save(customer);
    }

    @Override
    public CustomerResponse getById(Long id) {
        var result = commonComponent.getEntity(id, Customer.class, CUSTOMER);
        return convertObject(result, CustomerResponse.class);
    }

    @Override
    public PaginationResponse<CustomerResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var page = commonComponent.findAllEntities(Customer.class, CUSTOMER, keyword, searchAttributes, pageable);
        return getPaginationResponse(page, CustomerResponse.class);
    }

    @Override
    public List<CustomerResponse> getAll() {
        var result = this.customerRepo.findAll();
        return convertList(result, CustomerResponse.class);
    }

    public Customer getCustomer(Long id) {
        return this.customerRepo.findById(id).orElseThrow(throwNotFoundException(id, CUSTOMER));
    }
}
