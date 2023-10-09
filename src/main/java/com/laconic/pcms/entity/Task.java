package com.laconic.pcms.entity;

import com.laconic.pcms.enums.ProgressStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@Where(clause = "is_active = true")
public class Task extends BaseEntity<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
    @TableGenerator(name = "id_generator", table = "id_generator", pkColumnName = "id_name", valueColumnName = "next_id", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_type_id", nullable = false)
    private TaskStage taskStage;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "company_id", nullable = false)
//    private Company company;

    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id")
    private Milestone milestone;

    @ManyToMany
    @JoinTable(
            name = "project_task_project_tag",
            joinColumns = @JoinColumn(name = "project_task_id"),
            inverseJoinColumns = @JoinColumn(name = "project_tag_id")
    )
    private List<Tag> tags;

    @ManyToMany
    @JoinTable(
            name = "project_task_assignee",
            joinColumns = @JoinColumn(name = "project_task_id"),
            inverseJoinColumns = @JoinColumn(name = "assignee_id")
    )
    private List<User> assignees;

    @OneToMany(mappedBy = "task")
    private Set<SubTask> subTasks;
    private String name;
    private String description;
    private String priority;
    private Date deadlineDate;
    private Date assignedDate;
    private Boolean isBlocked;
    private Boolean isClosed;
//    private Integer progress;
    private String type;
}
