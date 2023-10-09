package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProjectRepo extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    Optional<Project> findByIdAndUserId(Long projectId, Long oldUserId);

    List<Project> findAllByUserId(Long id);
}
