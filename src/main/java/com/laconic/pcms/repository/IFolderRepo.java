package com.laconic.pcms.repository;

import com.laconic.pcms.entity.Folder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IFolderRepo extends JpaRepository<Folder, Long> {
    Page<Folder> findAll(Specification<Folder> specification, Pageable pageable);
    Page<Folder> findBySpaceId(Long spaceId, Pageable pageable);
}
