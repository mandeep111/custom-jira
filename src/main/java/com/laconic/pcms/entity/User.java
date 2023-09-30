package com.laconic.pcms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "app_user")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @ManyToMany(mappedBy = "assignees")
    private List<Task> tasks;

    @ManyToMany(mappedBy = "users")
    private List<Space> spaces;
}
