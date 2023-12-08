package com.laconic.pcms.entity;

import com.laconic.pcms.enums.TaskPriority;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Where;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedEntityGraph(name = "task.graph", attributeNodes = {
        @NamedAttributeNode("project"),
        @NamedAttributeNode(value = "taskStage"),
        @NamedAttributeNode(value = "tags")
})
@Where(clause = "is_active = true")
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

    private String color;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_task_project_tag",
            joinColumns = @JoinColumn(name = "project_task_id"),
            inverseJoinColumns = @JoinColumn(name = "project_tag_id")
    )
    @Fetch(FetchMode.SUBSELECT)
    private Set<Tag> tags;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "project_task_assignee",
            joinColumns = @JoinColumn(name = "project_task_id"),
            inverseJoinColumns = @JoinColumn(name = "assignee_id")
    )
    @Fetch(FetchMode.SUBSELECT)
    private Set<User> users;

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<SubTask> subTasks;
    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority;
    private Date deadlineDate;
    private Date assignedDate;
    private Boolean isBlocked;
    private Boolean isClosed;
    private String type;
    @Builder.Default
    private Double progress = 0.0;
    private Boolean isPrivate;
}
