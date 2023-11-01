package com.laconic.pcms.repository;

import com.laconic.pcms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @EntityGraph(value = "user.graph")
    Page<User> findAll(Specification<User> specification, Pageable pageable);

    @EntityGraph(value = "user.graph")
    Page<User> findAll(Pageable pageable);

    @EntityGraph(value = "user.graph")
    List<User> findAll();

    @EntityGraph(value = "user.graph")
    Optional<User> findById(Long id);

    @EntityGraph(value = "user.graph")
    Optional<User> findByIdAndSpaces_Id(Long id, Long spaceId);

    @EntityGraph(value = "user.graph")
    Optional<User> findByIdAndTasks_Id(Long id, Long taskId);

    @EntityGraph(value = "user.graph")
    List<User> findAllBySpaces_Id(Long spaceId);

    @EntityGraph(value = "user.graph")
    List<User> findAllByTasks_Id(Long taskId);
}
