package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Tag;
import com.laconic.pcms.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ITagRepo extends JpaRepository<Tag, Long> {
    @EntityGraph(value = "tag.graph")
    Page<Tag> findAll(Specification<Tag> specification, Pageable pageable);

    @EntityGraph(value = "tag.graph")
    Page<Tag> findAll(Pageable pageable);

    @EntityGraph(value = "tag.graph")
    List<Tag> findAll();

    @EntityGraph(value = "tag.graph")
    Optional<Tag> findById(Long id);
}
