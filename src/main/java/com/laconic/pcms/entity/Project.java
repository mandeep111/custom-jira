package com.laconic.pcms.entity;

import com.laconic.pcms.enums.ProgressStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Where;

import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedEntityGraph(name = "project.graph", attributeNodes = {
        @NamedAttributeNode("company"),
        @NamedAttributeNode("user"),
        @NamedAttributeNode("stage"),
        @NamedAttributeNode(value = "taskStages", subgraph = "taskStagesGraph"),
        @NamedAttributeNode("space"),
        @NamedAttributeNode(value = "tasks", subgraph = "tasksGraph")
},
        subgraphs = {
                @NamedSubgraph(name = "taskStagesGraph", attributeNodes = {
                        @NamedAttributeNode("user")
                }),
                @NamedSubgraph(name = "tasksGraph", attributeNodes = {
                        @NamedAttributeNode("subTasks"),
                })
        })
@Where(clause = "is_active = true")
public class Project extends BaseEntity<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
    @TableGenerator(name = "id_generator", table = "id_generator", pkColumnName = "id_name", valueColumnName = "next_id", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    private String color;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // responsible

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id")
    private Stage stage;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_task_stage",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "task_stage_id")
    )
    @Fetch(FetchMode.SUBSELECT)
    private Set<TaskStage> taskStages;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id")
    private Space space;

    private String name;
    private String label;
    private String description;
    private Boolean isRecurringAllowed;
    private String lastUpdateStatus;
    private Long lastUpdateId;
    private Date deadlineDate;
    private Date startDate;
    private String allocatedHours;
    @Builder.Default
    private Double progress = 0.0;
    private String url;
    @Builder.Default
    private Boolean isPrivate = false;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Task> tasks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @Enumerated(EnumType.STRING)
    ProgressStatus status;
}
