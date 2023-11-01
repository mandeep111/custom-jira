package com.laconic.pcms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Where(clause = "is_active = true")
@NamedEntityGraph(name = "tag.graph", attributeNodes = {
        @NamedAttributeNode("tasks")
})
public class Tag extends BaseEntity<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
    @TableGenerator(name = "id_generator", table = "id_generator", pkColumnName = "id_name", valueColumnName = "next_id", allocationSize = 1)
    private Long id;
    private String name;
    private String description;

    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    @Fetch(FetchMode.SUBSELECT)
    private List<Task> tasks;
}
