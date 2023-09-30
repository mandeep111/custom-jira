package com.laconic.pcms.repository;

import com.laconic.pcms.entity.MailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IMailTemplateRepo extends JpaRepository<MailTemplate, Long>, JpaSpecificationExecutor<MailTemplate> {
}
