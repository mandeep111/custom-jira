package com.laconic.pcms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Where;

import java.util.List;
import java.util.Set;

@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "app_user")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(name = "user.graph", attributeNodes = {
        @NamedAttributeNode("tasks"),
        @NamedAttributeNode("spaces")
})
@Where(clause = "is_active = true")
public class User extends BaseEntity<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
    @TableGenerator(name = "id_generator", table = "id_generator", pkColumnName = "id_name", valueColumnName = "next_id", allocationSize = 1)
    @Column(name = "user_id")
    private Long id;
    @NotNull
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$")
    private String email;
    private String fullName;
    @NotNull
    private String password;

    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
    @Fetch(FetchMode.SUBSELECT)
    private Set<Task> tasks;

    @ManyToMany(mappedBy = "users", fetch = FetchType.LAZY)
    @Fetch(FetchMode.SUBSELECT)
    private Set<Space> spaces;
}
