package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProjectRepo extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    @EntityGraph(value = "project.graph")
    Optional<Project> findByIdAndUserId(Long projectId, Long oldUserId);

    @EntityGraph(value = "project.graph")
    List<Project> findAllByUserId(Long id);
    Page<Project> findAllByUserId(Long id, Pageable pageable);

    @EntityGraph(value = "project.graph")
    Page<Project> findAll(Specification<Project> specification, Pageable pageable);

    @EntityGraph(value = "project.graph")
    Page<Project> findAll(Pageable pageable);

    @EntityGraph(value = "project.graph")
    List<Project> findAll();

    @EntityGraph(value = "project.graph")
    Optional<Project> findById(Long id);

    @EntityGraph(value = "project.graph")
    List<Project> findAllByFolderId(Long id);

    List<Project> findAllByCompanyId(Specification<Project> byDateBetween);
    @EntityGraph(value = "project.graph")
    List<Project> findAllBySpaceId(Long spaceId);

    @EntityGraph(value = "project.graph")
    List<Project> findBySpaceId(Long spaceId);
}
