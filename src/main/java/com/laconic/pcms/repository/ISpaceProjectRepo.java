package com.laconic.pcms.repository;

import com.laconic.pcms.entity.SpaceProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISpaceProjectRepo extends JpaRepository<SpaceProject, Long> {
}
