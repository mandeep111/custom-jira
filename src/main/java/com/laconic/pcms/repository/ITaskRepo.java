package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ITaskRepo extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    Optional<Task> findByProjectIdAndId(Long projectId, Long taskId);

    List<Task> findAllByAssignees_Id(Long id);


}
