package com.laconic.pcms.repository;

import com.laconic.pcms.entity.SubTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ISubTaskRepo extends JpaRepository<SubTask, Long>, JpaSpecificationExecutor<SubTask> {
    List<SubTask> findAllByAssigneeId(Long id);
}
