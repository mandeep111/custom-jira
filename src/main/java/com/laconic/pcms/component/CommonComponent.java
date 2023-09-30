package com.laconic.pcms.component;

import com.laconic.pcms.entity.*;
import com.laconic.pcms.exceptions.NotFoundException;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

import static com.laconic.pcms.constants.AppMessages.NOT_FOUND_WITH_ID_FORMAT;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Component
@RequiredArgsConstructor
public class CommonComponent {

    @PersistenceContext
    private EntityManager entityManager;
    private final ICompanyRepo companyRepo;
    private final ICustomerRepo customerRepo;
    private final IMailTemplateRepo mailTemplateRepo;
    private final IMilestoneRepo milestoneRepo;
    private final IProjectRepo projectRepo;
    private final IStageRepo projectStageRepo;
    private final ITagRepo projectTagRepo;
    private final ITaskRepo projectTaskRepo;
    private final ITaskStageRepo taskTypeRepo;
    private final IUserRepo userRepo;
    private final ISpaceRepo spaceRepo;

    /**
     * Provide entityId, class type and entityName
     * @param id
     * @param entityType
     * @param entityName
     * @return
     * @param <T>
     */
    public <T> T getEntity(Long id, Class<T> entityType, String entityName) {
        JpaRepository<?, Long> repository = getRepository(entityType, entityName);

        // Use a Supplier to throw a not found exception if the entity is not present
        Supplier<T> entitySupplier = () -> (T) repository.findById(id)
                .orElseThrow(throwNotFoundException(id, entityName));

        return entitySupplier.get();
    }

    public <T> Long findIdById(Class<T> entityClass, Long id, String entityName) {
        T entity = entityManager.find(entityClass, id);
        if (entity == null) {
            throw new NotFoundException(String.format(NOT_FOUND_WITH_ID_FORMAT, entityName, id));
        }
        try {
            // ID property should be named "id"
            return (Long) entity.getClass()
                    .getMethod("getId")
                    .invoke(entity);
        } catch (Exception e) {
            throw new RuntimeException("Error extracting ID from entity", e);
        }
    }


    /**
     * Generic method to save any entity dynamically
     * @param entity
     * @param entityName
     * @return
     * @param <T>
     */
    public <T> T saveEntity(T entity, String entityName) {
        JpaRepository<T, Long> repository = (JpaRepository<T, Long>) getRepository(entity.getClass(), entityName);
        return repository.save(entity);
    }

    /**
     * Find all entities
     * @param entityType
     * @param entityName
     * @return
     * @param <T>
     */
    public <T> List<T> findAllEntities(Class<T> entityType, String entityName) {
        JpaRepository<T, Long> repository = (JpaRepository<T, Long>) getRepository(entityType, entityName);
        return repository.findAll();
    }

    /**
     * Find all entities with search attributes, and pagination
     * @param entityType
     * @param entityName
     * @param keyword
     * @param searchAttributes
     * @param pageable
     * @return
     * @param <T>
     */

    public <T> Page<T> findAllEntities(Class<T> entityType, String entityName, String keyword, List<String> searchAttributes, Pageable pageable) {
        JpaRepository<T, Long> repository = (JpaRepository<T, Long>) getRepository(entityType, entityName);

        if (keyword != null) {
            // filter using name attribute by default
            if (searchAttributes == null || searchAttributes.isEmpty()) {
                searchAttributes = new ArrayList<>();
                searchAttributes.add("name");
            }

            List<String> finalSearchAttributes = searchAttributes;
            Specification<T> specification = (root, query, criteriaBuilder) -> {
                List<Predicate> predicates = new ArrayList<>();
                for (String attribute : finalSearchAttributes) {
                    try {
                        if (isBooleanProperty(entityType, attribute)) {
                            predicates.add(criteriaBuilder.equal(root.get(attribute), Boolean.parseBoolean(keyword)));
                        } else {
                            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get(attribute).as(String.class)), "%" + keyword.toLowerCase() + "%"));
                        }
                    } catch (Exception e) {
                        throw new PreconditionFailedException(attribute + " property not found in " + entityName);
                    }
                }
                return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
            };
            // using reflection to call findAll method with specification
            try {
                Method findAllMethod = repository.getClass().getMethod("findAll", Specification.class, Pageable.class);
                return (Page<T>) findAllMethod.invoke(repository, specification, pageable);
            } catch (Exception e) {
                throw new RuntimeException("Error invoking findAll method with Specification and Pageable", e);
            }
        } else {
            return repository.findAll(pageable);
        }
    }

    public boolean isBooleanProperty(Class<?> entityType, String attributeName) {
        try {
            Field field = entityType.getDeclaredField(attributeName);
            return field.getType() == boolean.class || field.getType() == Boolean.class || (field.getType() == Boolean.TYPE);
        } catch (NoSuchFieldException e) {
            return false; // Property doesn't exist
        }
    }


    private <T> JpaRepository<?, Long> getRepository(Class<T> entityType, String entityName) {
        if (entityType.equals(Company.class)) {
            return companyRepo;
        } else if (entityType.equals(Customer.class)) {
            return customerRepo;
        } else if (entityType.equals(MailTemplate.class)) {
            return mailTemplateRepo;
        } else if (entityType.equals(Milestone.class)) {
            return milestoneRepo;
        } else if (entityType.equals(Project.class)) {
            return projectRepo;
        } else if (entityType.equals(Stage.class)) {
            return projectStageRepo;
        } else if (entityType.equals(Tag.class)) {
            return projectTagRepo;
        } else if (entityType.equals(Task.class)) {
            return projectTaskRepo;
        } else if (entityType.equals(TaskStage.class)) {
            return taskTypeRepo;
        } else if (entityType.equals(User.class)) {
            return userRepo;
        } else if (entityType.equals(Space.class)) {
            return spaceRepo;
        } else {
            throw new IllegalArgumentException("Unsupported entity type: " + entityName);
        }
    }

}
