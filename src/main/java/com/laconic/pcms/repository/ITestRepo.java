package com.laconic.pcms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;

@NoRepositoryBean
public interface ITestRepo<T, ID extends Serializable>
        extends JpaRepository<T, ID> {
    <P> Page<P> findBySpecAndProjection(Specification<T> spec, Class<P> projection, Pageable pageable);
    <P> Page<P> findAllBy(Class<P> projection, Pageable pageable);
}

