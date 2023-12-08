package com.laconic.pcms.specification;

import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.Space;
import com.laconic.pcms.entity.Task;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpec {

    public static Specification<Task> taskBySpace(Long spaceId) {
        return (root, query, criteriaBuilder) -> {
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<Project> projectRoot = subquery.from(Project.class);
            Join<Project, Space> spaceJoin = projectRoot.join("space");
            subquery.select(projectRoot.get("id")).where(criteriaBuilder.equal(spaceJoin.get("id"), spaceId));
            return criteriaBuilder.in(root.get("project").get("id")).value(subquery);
        };
    }


    public static Specification<Task> tasksByProject(Long projectId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("project").get("id"), projectId);
    }

    public static Specification<Task> getBySpaceAndProject(Long spaceId, Long projectId) {
        return (root, query, criteriaBuilder) -> {
            root.join("project", JoinType.LEFT);
            root.join("project").join("space", JoinType.LEFT);
            var spaceIdPredicate = criteriaBuilder.equal(root.get("project").get("space").get("id"), spaceId);
            var projectIdPredicate = criteriaBuilder.equal(root.get("project").get("id"), projectId);
            return criteriaBuilder.and(spaceIdPredicate, projectIdPredicate);
        };
    }

}
