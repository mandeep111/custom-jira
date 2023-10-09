package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITagRepo extends JpaRepository<Tag, Long> {
}
