package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ICompanyRepo extends JpaRepository<Company, Long>, JpaSpecificationExecutor<Company> {
}
