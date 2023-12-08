package com.laconic.pcms.repository;

import com.laconic.pcms.entity.SubTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ISubTaskRepo extends JpaRepository<SubTask, Long>, JpaSpecificationExecutor<SubTask>, ITestRepo<SubTask, Long> {
    @EntityGraph(value = "sub-task.graph")
    List<SubTask> findAllByUserId(Long id);

    @EntityGraph(value = "sub-task.graph")
    Page<SubTask> findAllByUserId(Long id, Pageable pageable);

    @EntityGraph(value = "sub-task.graph")
    Page<SubTask> findAll(Pageable pageable);

    @EntityGraph(value = "sub-task.graph")
    List<SubTask> findAll();

    @EntityGraph(value = "sub-task.graph")
    Optional<SubTask> findById(Long id);

    // new approach

    @EntityGraph(value = "sub-task.graph")
    Page<SubTask> findAllBy(Specification<SubTask> specification, Pageable pageable);


/*    @Query(value = "select st.* from sub_task st left join task t on t.id = st.task_id left join project p on p.id = t.project_id where p.id = :projectId AND " +
            "(st.assigned_date BETWEEN :startDate AND :endDate OR st.deadline_date BETWEEN :startDate AND :endDate)", nativeQuery = true)
    List<SubTask> findAllByProjectId(Long projectId, Date startDate, Date endDate);

    @Query(value = "SELECT st.* FROM sub_task st LEFT JOIN task t ON t.id = st.task_id LEFT JOIN project p ON p.id = t.project_id " +
            "LEFT JOIN space s ON p.SPACE_ID = s.id WHERE s.id = :spaceId AND s.is_private = 0 AND t.is_active = 1 AND p.is_active = 1 " +
            "AND (st.assigned_date BETWEEN :startDate AND :endDate OR st.deadline_date BETWEEN :startDate AND :endDate)",nativeQuery =true)
    List<SubTask> findAllBySpaceId(Long spaceId, Date startDate, Date endDate);*/

    @Query(value = "select st.* from sub_task st left join task t on t.id = st.task_id left join project p on p.id = t.project_id where p.id = :projectId AND " +
            "(TRUNC(st.assigned_date) BETWEEN TRUNC(:startDate) AND TRUNC(:endDate) OR TRUNC(st.deadline_date) BETWEEN TRUNC(:startDate) AND TRUNC(:endDate))", nativeQuery = true)
    List<SubTask> findAllByProjectId(Long projectId, Date startDate, Date endDate);

    @Query(value = "SELECT st.* FROM sub_task st LEFT JOIN task t ON t.id = st.task_id LEFT JOIN project p ON p.id = t.project_id " +
            "LEFT JOIN space s ON p.SPACE_ID = s.id WHERE s.id = :spaceId AND s.is_private = 0 AND t.is_active = 1 AND p.is_active = 1 " +
            "AND (TRUNC(st.assigned_date) BETWEEN TRUNC(:startDate) AND TRUNC(:endDate) OR TRUNC(st.deadline_date) BETWEEN TRUNC(:startDate) AND TRUNC(:endDate))", nativeQuery = true)
    List<SubTask> findAllBySpaceId(Long spaceId, Date startDate, Date endDate);

    @EntityGraph(value = "sub-task.graph")
    List<SubTask> findAllByAssignedDateBetween(Date startDate, Date endDate);

    @EntityGraph(value = "sub-task.graph")
    List<SubTask> findByTaskId(Long id);

    @EntityGraph(value = "sub-task.graph")
    List<SubTask> findAllByBlockedBy(Long blockedBy);


/*    // future use to reduce queries
    Page<SubTaskRecords.ST> findAllBy(Pageable pageable)
    Page<SubTaskRecords.ST> findAllBy(Pageable pageable);
    Optional<SubTaskRecords.WithTaskAndUser> findSubTaskById(Long id);
 */

}
