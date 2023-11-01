package com.laconic.pcms.repository;

import com.laconic.pcms.entity.FavoriteProject;
import com.laconic.pcms.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IFavoriteProjectRepo extends JpaRepository<FavoriteProject, Long> {
    Optional<FavoriteProject> findByUserIdAndProjectId(Long userId, Long projectId);

    List<FavoriteProject> findAllByUserId(Long id);
    Page<FavoriteProject> findAllByUserId(Long id, Pageable pageable);
}
