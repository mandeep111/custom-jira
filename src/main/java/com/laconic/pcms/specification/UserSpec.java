package com.laconic.pcms.specification;

import com.laconic.pcms.entity.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class UserSpec {
    /**
     *
     * @param email -> user email to filter
     * @param table -> name may be user or users based on join type
     * @return -> returns list of users by email
     */
    public static <T> Specification<T> getByUserEmail(String email, String table) {
        return (root, query, cb) -> {
            Join<T, User> userJoin = root.join(table);
            return cb.equal(cb.lower(userJoin.get("email")), email.toLowerCase());
        };
    }
    public static <T> Specification<T> getByUserId(Class<T> entityClass, Long userId, String table) {
        return (root, query, cb) -> {
            Join<T, User> userJoin = root.join(table, JoinType.LEFT);
            return cb.equal(userJoin.get("id"), userId);
        };
    }


    /**
     *
     * @param userId -> user id to filter
     * @param table -> name may be user or users based on join type
     * @return -> returns list of users by id
     */
    public static <T> Specification<T> getByUserId(Long userId, String table) {
        return (root, query, cb) -> {
            Join<T, User> userJoin = root.join(table);
            return cb.equal(userJoin.get("id"), userId);
        };
    }
}
