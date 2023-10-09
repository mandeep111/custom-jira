package com.laconic.pcms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Where(clause = "is_active = true")
public class TaskStage extends BaseEntity<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
    @TableGenerator(name = "id_generator", table = "id_generator", pkColumnName = "id_name", valueColumnName = "next_id", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String description;
    private Boolean isFold;
    private String color;
    @ManyToMany(mappedBy = "taskStages")
    private List<Project> projects;

/*    @OneToMany(mappedBy = "taskStage")
    private List<ProjectTaskStage> projectTaskStages = new ArrayList<>();*/

}
