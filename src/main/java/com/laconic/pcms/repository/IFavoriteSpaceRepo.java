package com.laconic.pcms.repository;

import com.laconic.pcms.entity.FavoriteSpace;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IFavoriteSpaceRepo extends JpaRepository<FavoriteSpace, Long> {
    Optional<FavoriteSpace> findByUserIdAndSpaceId(Long userId, Long id);

    List<FavoriteSpace> findAllByUserId(Long id);
    Page<FavoriteSpace> findAllByUserId(Long id, Pageable pageable);
}
