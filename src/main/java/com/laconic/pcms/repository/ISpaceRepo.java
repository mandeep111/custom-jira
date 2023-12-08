package com.laconic.pcms.repository;

import com.laconic.pcms.entity.*;
import com.laconic.pcms.record.SpaceRecords;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public interface ISpaceRepo extends JpaRepository<Space, Long>, JpaSpecificationExecutor<Space> {
    @EntityGraph(value = "space.graph")
    Page<Space> findAllByUsers_EmailEqualsIgnoreCase(String email, Pageable pageable);
    @EntityGraph(value = "space.graph")
    Optional<Space> findByIdAndUrlEqualsIgnoreCase(Long id, String url);

    @EntityGraph(value = "space.graph")
    Page<Space> findAll(Specification<Space> specification, Pageable pageable);

    @EntityGraph(value = "space.graph")
    Page<Space> findAll(Pageable pageable);

    @EntityGraph(value = "space.graph")
    List<Space> findAll();

    @EntityGraph(value = "space.graph")
    Optional<Space> findById(Long id);

    Optional<SpaceRecords.S> findSpaceById(Long id);

    @EntityGraph(value = "space.graph")
    Page<Space> findAllBy(Pageable pageable);

    List<Space> findAllByIsPrivateFalseOrUsersId(Long userId);

    @Query(value = "SELECT s.* FROM Space s WHERE s.id = :id AND s.is_private = 0 AND s.creation_date BETWEEN :startDate AND :endDate", nativeQuery = true)
    Optional<Space> findByIdAndIsPrivateFalseAndCreatedDateBetween(Long id, Date startDate, Date endDate);

    @Query(value = "SELECT s.* FROM Space s WHERE s.is_private = 0 AND s.creation_date BETWEEN :startDate AND :endDate", nativeQuery = true)
    List<Space> findAllByIsPrivateFalseAndCreatedDateBetween(Date startDate, Date endDate);

    @Query("SELECT s FROM Space s " +
            "LEFT JOIN FETCH s.projects projects " +
            "LEFT JOIN FETCH s.users users " +
            "WHERE s.id = :spaceId")
    Space findByIdWithProjectsAndUsers(Long spaceId);

    @EntityGraph(value = "space.graph")
    Optional<Space> findByUrlEqualsIgnoreCase(String url);
}
