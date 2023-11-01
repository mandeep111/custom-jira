package com.laconic.pcms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Where;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Where(clause = "is_active = true")
@NamedEntityGraph(name = "space.graph", attributeNodes = {
        @NamedAttributeNode("projects"),
        @NamedAttributeNode("users"),
        @NamedAttributeNode("folders")
})
public class Space extends BaseEntity<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
    @TableGenerator(name = "id_generator", table = "id_generator", pkColumnName = "id_name", valueColumnName = "next_id", allocationSize = 1)
    private Long id;

    private String name;
    private String tags;
    private String color;
    private String url;
    @OneToMany(mappedBy = "space", fetch = FetchType.LAZY)
    @Where(clause = "folder_id IS NULL") // map projects without folder
    private Set<Project> projects;

    @OneToMany(mappedBy = "space", fetch = FetchType.LAZY)
    private Set<Folder> folders;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "space_assignees",
            joinColumns = @JoinColumn(name = "space_id"),
            inverseJoinColumns = @JoinColumn(name = "assignee_id")
    )
//    @Fetch(FetchMode.SUBSELECT)
    private Set<User> users = new HashSet<>();
    @Builder.Default
    private Boolean isPrivate = false;
    private Boolean isOpen;
    private String description;
}
