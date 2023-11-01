package com.laconic.pcms.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.ManagedType;
import org.hibernate.graph.spi.RootGraphImplementor;
import org.hibernate.jpa.spi.JpaCompliance;
import org.hibernate.metamodel.model.domain.EmbeddableDomainType;
import org.hibernate.metamodel.model.domain.EntityDomainType;
import org.hibernate.metamodel.model.domain.JpaMetamodel;
import org.hibernate.metamodel.model.domain.ManagedDomainType;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.spi.TypeConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.*;

public class ITestRepoImpl<T, ID extends Serializable> extends SimpleJpaRepository<T, ID> implements ITestRepo<T, ID> {
    private final EntityManager entityManager;

    public ITestRepoImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
    }



    private <P> List<P> getResultList(Class<P> projection, CriteriaBuilder criteriaBuilder, CriteriaQuery<P> query, Root<T> root, Specification<T> spec, Pageable pageable) {
        query.select(criteriaBuilder.construct(projection));
        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, query, criteriaBuilder);
            if (predicate != null) {
                query.where(predicate);
            }
        }
        TypedQuery<P> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        List<P> resultList = typedQuery.getResultList();
        return Objects.requireNonNullElse(resultList, Collections.emptyList());
    }



    @Override
    public <P> Page<P> findBySpecAndProjection(Specification<T> spec, Class<P> projection, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<P> query = criteriaBuilder.createQuery(projection);
        Root<T> root = query.from(getDomainClass());
        List<P> resultList = getResultList(projection, criteriaBuilder, query, root, spec, pageable);

        // Count the total results
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<T> countRoot = countQuery.from(getDomainClass());
        countQuery.select(criteriaBuilder.count(countRoot));
        countQuery.where(spec.toPredicate(countRoot, countQuery, criteriaBuilder));
        Long total = entityManager.createQuery(countQuery).getSingleResult();
        return new PageImpl<>(resultList, pageable, total);
    }


    @Override
    public <P> Page<P> findAllBy(Class<P> projection, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<P> query = criteriaBuilder.createQuery(projection);
        Root<T> root = query.from(getDomainClass());
        List<P> resultList = getResultList(projection, criteriaBuilder, query, root, null, pageable);

        // Count the total results
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<T> countRoot = countQuery.from(getDomainClass());
        countQuery.select(criteriaBuilder.count(countRoot));
        Long total = entityManager.createQuery(countQuery).getSingleResult();
        return new PageImpl<>(resultList, pageable, total);
    }
}

