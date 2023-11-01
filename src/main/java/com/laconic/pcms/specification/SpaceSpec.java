package com.laconic.pcms.specification;

import com.laconic.pcms.entity.Space;
import com.laconic.pcms.entity.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

import static com.laconic.pcms.specification.UserSpec.getByUserId;

public class SpaceSpec {

    public static Specification<Space> getBySpaceName(String spaceName) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + spaceName.toLowerCase().trim() + "%");
    }

    public static Specification<Space> getIsPrivate(boolean isPrivate) {
        return (root, query, cb) -> {
            if (isPrivate) {
                return cb.isTrue(root.get("isPrivate"));
            } else {
                return cb.isFalse(root.get("isPrivate"));
            }
        };
    }

    public static <T> Specification<T> getBySpaceId(Long spaceId, String table) {
        return (root, query, cb) -> {
            Join<T, Space> spaceJoin = root.join(table);
            return cb.equal(spaceJoin.get("id"), spaceId);
        };
    }

    public static Specification<Space> spacesForUser(User user) {
        return (root, query, cb) -> {
            Predicate isNotPrivate = cb.isFalse(root.get("isPrivate"));
            Predicate spaceUser = cb.and(
                    cb.isTrue(root.get("isPrivate")),
                    cb.equal(cb.literal(true),
                            cb.and(
                                    cb.isTrue(root.get("isPrivate")),
                                    cb.equal(root.get("users"), user)
                            )
                    )
            );
            return cb.or(isNotPrivate, spaceUser);
        };
    }


    /*public static Specification<Space> spacesForUser(User user) {
        return (root, query, cb) -> {
            Predicate isNotPrivate = cb.isFalse(root.get("isPrivate"));
            Predicate assignedToUser = cb.isMember(user, root.get("users"));
            Predicate spaceUser = cb.and(cb.isTrue(root.get("isPrivate")), assignedToUser);
            return cb.or(isNotPrivate, spaceUser);
        };
    }
*/
    public static Specification<Space> getPublicOrAssignedToUser(User user) {
        return (root, query, cb) -> {
            Predicate isPublic = getIsPrivate(false).toPredicate(root, query, cb);
            Predicate isPrivate = getIsPrivate(true).toPredicate(root, query, cb);
            Predicate assignedToUser = getByUserId(Space.class, user.getId(), "users").toPredicate(root, query, cb);
            Predicate isSpaceUser = cb.and(isPrivate, assignedToUser);
            return cb.or(isPublic, isSpaceUser);
        };
    }

    public static Specification<Space> getDateBetween(Date startDate, Date endDate) {
        return (root, query, cb) -> {
            Path<Date> datePath = root.get("createdDate"); // Replace with your actual date attribute
            return cb.between(datePath, startDate, endDate);
        };
    }


}
