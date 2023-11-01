package com.laconic.pcms.repository;

import com.laconic.pcms.entity.TaskStage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ITaskStageRepo extends JpaRepository<TaskStage, Long>, JpaSpecificationExecutor<TaskStage> {

    @EntityGraph(value = "task-stage.graph")
    Page<TaskStage> findAll(Specification<TaskStage> specification, Pageable pageable);

    @EntityGraph(value = "task-stage.graph")
    Page<TaskStage> findAll(Pageable pageable);

    @EntityGraph(value = "task-stage.graph")
    List<TaskStage> findAll();

    @EntityGraph(value = "task-stage.graph")
    Optional<TaskStage> findById(Long id);

    @EntityGraph(value = "task-stage.graph")
    List<TaskStage> findByProjectsId(Long projectId, Sort sort);
}
