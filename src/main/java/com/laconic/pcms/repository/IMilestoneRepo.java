package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Milestone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IMilestoneRepo extends JpaRepository<Milestone, Long> {
    Page<Milestone> findAllByProjectId(Long projectId, PageRequest pageable);

    Page<Milestone> findAllByProjectIdAndNameEqualsIgnoreCase(Long projectId, String keyword, PageRequest pageable);

    Optional<Milestone> findByIdAndProjectId(Long id, Long projectId);
}
