package com.laconic.pcms.repository;

import com.laconic.pcms.entity.TaskStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ITaskStageRepo extends JpaRepository<TaskStage, Long>, JpaSpecificationExecutor<TaskStage> {
}
