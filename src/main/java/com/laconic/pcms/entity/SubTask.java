package com.laconic.pcms.entity;

import com.laconic.pcms.enums.ProgressStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Where(clause = "is_active = true")
public class SubTask extends BaseEntity<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "id_generator")
    @TableGenerator(name = "id_generator", table = "id_generator", pkColumnName = "id_name", valueColumnName = "next_id", allocationSize = 1)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "assignee_id", nullable = false)
    private User assignee;

    private String name;
    private String description;
    private Date deadlineDate;
    private Date assignedDate;
    private Boolean isBlocked;
    private Boolean isClosed;
    private Integer progress;
    private String type;
    private String color;
    @Enumerated(EnumType.STRING)
    ProgressStatus status;

    private Boolean needApproval;
    private String requestCode;
    private String url;
}
