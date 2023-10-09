package com.laconic.pcms.service.concrete;

import com.laconic.pcms.entity.Customer;
import com.laconic.pcms.request.CustomerRequest;
import com.laconic.pcms.response.CustomerResponse;
import com.laconic.pcms.response.PaginationResponse;

import java.util.List;

public interface ICustomerService {
    void save(CustomerRequest request);
    void update(CustomerRequest request, Long id);
    CustomerResponse getById(Long id);
    PaginationResponse<CustomerResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);
    List<CustomerResponse> getAll();
}
