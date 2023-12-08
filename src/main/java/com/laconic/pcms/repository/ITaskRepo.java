package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Task;
import org.jetbrains.annotations.NotNull;
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
public interface ITaskRepo extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    @EntityGraph(value = "task.graph")
    Optional<Task> findByProjectIdAndId(Long projectId, Long taskId);

    @EntityGraph(value = "task.graph")
    List<Task> findAllByUsers_Id(Long id);
    @EntityGraph(value = "task.graph")
    Page<Task> findAllByUsers_Id(Long id, Pageable pageable);

    @EntityGraph(value = "task.graph", type = EntityGraph.EntityGraphType.FETCH)
//    @EntityGraph(attributePaths = {"project", "taskStage", "tags", "subTasks", "assignees"})
    Page<Task> findAll(@NotNull Pageable pageable);

    @EntityGraph(value = "task.graph", type = EntityGraph.EntityGraphType.FETCH)
    List<Task> findAll();
    @EntityGraph(value = "task.graph", type = EntityGraph.EntityGraphType.FETCH)
    List<Task> findAll(@NotNull Specification<Task> specification);

    @EntityGraph(value = "task.graph", type = EntityGraph.EntityGraphType.FETCH)
    Page<Task> findAll(@NotNull Specification<Task> specification, @NotNull Pageable pageable);

    @EntityGraph(value = "task.graph", type = EntityGraph.EntityGraphType.FETCH)
    Optional<Task> findById(Long id);

    @EntityGraph(value = "task.graph", type = EntityGraph.EntityGraphType.FETCH)
    List<Task> findByProjectId(Long project);

    List<Task> findAllByUsers_IdOrderByIdAsc(Long userId);


}