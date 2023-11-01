package com.laconic.pcms.specification;

import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class ProjectSpec {
    public static <T> Specification<T> getByProjectId(Class<T> entityClass, Long projectId, String table) {
        return (root, query, cb) -> {
            Join<T, Project> projectJoin = root.join(table, JoinType.LEFT);
            return cb.equal(projectJoin.get("id"), projectId);
        };
    }
}
