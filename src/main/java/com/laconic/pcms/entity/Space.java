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
public class Space extends BaseEntity<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
    @TableGenerator(name = "id_generator", table = "id_generator", pkColumnName = "id_name", valueColumnName = "next_id", allocationSize = 1)
    private Long id;

    private String name;
    private String tags;
    private String color;
    private String url;
    @OneToMany(mappedBy = "space")
    private List<Project> projects;

/*    @OneToMany(mappedBy = "space")
    private List<SpaceProject> spaceProjects = new ArrayList<>();*/

    @ManyToMany
    @JoinTable(
            name = "space_assignees",
            joinColumns = @JoinColumn(name = "space_id"),
            inverseJoinColumns = @JoinColumn(name = "assignee_id")
    )
    private List<User> users = new ArrayList<>();

    @Builder.Default
    private Boolean isPrivate = false;
    private Boolean isOpen;
    private String description;
}
