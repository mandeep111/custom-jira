package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Space;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ISpaceRepo extends JpaRepository<Space, Long>, JpaSpecificationExecutor<Space> {
    Page<Space> findAllByUsers_EmailEqualsIgnoreCase(String email, Pageable pageable);

    Optional<Space> findByIdAndUrlEqualsIgnoreCase(Long id, String url);
}
