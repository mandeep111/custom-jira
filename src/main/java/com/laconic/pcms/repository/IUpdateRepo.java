package com.laconic.pcms.repository;

import com.laconic.pcms.entity.ProjectUpdate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUpdateRepo extends JpaRepository<ProjectUpdate, Long> {
    Page<ProjectUpdate> findAllByProject_Id(Long projectId, PageRequest pageable);
}
