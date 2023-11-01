package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.MailTemplate;
import com.laconic.pcms.repository.IMailTemplateRepo;
import com.laconic.pcms.request.MailTemplateRequest;
import com.laconic.pcms.response.MailTemplateResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.IMailTemplateService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.MAIL_TEMPLATE;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class MailTemplateService implements IMailTemplateService {
    private final IMailTemplateRepo mailTemplateRepo;
    private final CommonComponent commonComponent;

    public MailTemplateService(IMailTemplateRepo mailTemplateRepo, CommonComponent commonComponent) {
        this.mailTemplateRepo = mailTemplateRepo;
        this.commonComponent = commonComponent;
    }

    @Override
    public void save(MailTemplateRequest request) {
        var mailTemplate = convertObject(request, MailTemplate.class);
        this.mailTemplateRepo.save(mailTemplate);
    }

    @Override
    public void update(MailTemplateRequest request, Long id) {
        var mailTemplate = getMailTemplate(id);
        mailTemplate.setEmailFrom(request.getEmailFrom());
        mailTemplate.setEmailTo(request.getEmailTo());
        mailTemplate.setName(request.getName());
        mailTemplate.setDescription(request.getDescription());
        mailTemplate.setSubject(request.getSubject());
        mailTemplate.setBody(request.getBody());
        mailTemplate.setEmailCC(request.getEmailCC());
        mailTemplate.setReplyTo(request.getReplyTo());
        mailTemplate.setModel(request.getModel());
        this.mailTemplateRepo.save(mailTemplate);
    }

    @Override
    public MailTemplateResponse getById(Long id) {
        var result = getMailTemplate(id);
        return convertObject(result, MailTemplateResponse.class);
    }

    @Override
    public PaginationResponse<MailTemplateResponse>  getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<MailTemplate> page;
        if (keyword != null) {
            var specs = CommonComponent.getSpecification(MailTemplate.class, MAIL_TEMPLATE, keyword, searchAttributes);
            page = this.mailTemplateRepo.findAll(specs, pageable);
        } else page = this.mailTemplateRepo.findAll(pageable);
        return getPaginationResponse(page, MailTemplateResponse.class);
    }

    @Override
    public List<MailTemplateResponse> getAll() {
        var result = this.mailTemplateRepo.findAll();
        return convertList(result, MailTemplateResponse.class);
    }

    /**
     * @param id
     */
    @Override
    public void delete(Long id) {
        var result = commonComponent.getEntity(id, MailTemplate.class, MAIL_TEMPLATE);
        result.setActive(false);
        this.mailTemplateRepo.save(result);
    }

    public MailTemplate getMailTemplate(Long id) {
        return this.mailTemplateRepo.findById(id).orElseThrow(throwNotFoundException(id, MAIL_TEMPLATE));
    }
}
