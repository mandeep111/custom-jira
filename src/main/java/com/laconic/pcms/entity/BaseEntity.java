package com.laconic.pcms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
public abstract class BaseEntity<T> {
    @Column(name = "created_by")
    @CreatedBy
    private T createdBy;

    @Column(name = "updated_by")
    @LastModifiedBy
    private T updatedBy;

    @Column(name = "creation_date")
    @CreatedDate
    private Date creationDate;

    @Column(name = "updated_date")
    @LastModifiedDate
    private Date updatedDate;

    @Column(name = "is_active")
    boolean isActive = true;
}

