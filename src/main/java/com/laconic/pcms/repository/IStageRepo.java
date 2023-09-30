package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IStageRepo extends JpaRepository<Stage, Long> {
}
