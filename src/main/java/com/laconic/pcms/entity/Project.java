package com.laconic.pcms.entity;

import com.laconic.pcms.enums.ProgressStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.util.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @ManyToMany
    @JoinTable(
            name = "project_task_stage",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "task_stage_id")
    )
    private List<TaskStage> taskStages;

//    @ManyToMany
//    @JoinTable(
//            name = "space_projects",
//            joinColumns = @JoinColumn(name = "space_id"),
//            inverseJoinColumns = @JoinColumn(name = "project_id")
//    )
//    private Set<Space> spaces = new HashSet<>();

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
    private String url;
    @Builder.Default
    private Boolean isPrivate = false;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    @Where(clause = "is_active = true")
    private List<Task> tasks;

    @Enumerated(EnumType.STRING)
    ProgressStatus status;
}
