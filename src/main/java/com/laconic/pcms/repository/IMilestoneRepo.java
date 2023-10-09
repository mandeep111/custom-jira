package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IMilestoneRepo extends JpaRepository<Milestone, Long> {
}
