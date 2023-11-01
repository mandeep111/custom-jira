package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ICustomerRepo extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
}
