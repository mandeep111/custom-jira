package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.Stage;
import com.laconic.pcms.repository.IMailTemplateRepo;
import com.laconic.pcms.repository.IStageRepo;
import com.laconic.pcms.request.StageRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.StageResponse;
import com.laconic.pcms.service.concrete.IStageService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.MAIL_TEMPLATE;
import static com.laconic.pcms.constants.AppMessages.STAGE;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class StageService implements IStageService {
    private final IStageRepo projectStageRepo;
    private final IMailTemplateRepo mailTemplateRepo;
    private final CommonComponent commonComponent;

    public StageService(IStageRepo projectStageRepo, IMailTemplateRepo mailTemplateRepo, CommonComponent commonComponent) {
        this.projectStageRepo = projectStageRepo;
        this.mailTemplateRepo = mailTemplateRepo;
        this.commonComponent = commonComponent;
    }

    /**
     * @param request
     */
    @Override
    public void save(StageRequest request) {
        var projectStage = convertObject(request, Stage.class);
        if (request.getMailTemplateId() != null) {
            var mailTemplate = this.mailTemplateRepo.findById(request.getMailTemplateId())
                    .orElseThrow(throwNotFoundException(request.getMailTemplateId(), MAIL_TEMPLATE));
            projectStage.setMailTemplate(mailTemplate);
        }
        this.projectStageRepo.save(projectStage);
    }

    /**
     * @param request
     */
    @Override
    public void update(StageRequest request, Long id) {
        var stage = getStage(id);
        stage.setName(request.getName());
        this.projectStageRepo.save(stage);
    }

    /**
     * @param id
     * @return
     */
    @Override
    public StageResponse getById(Long id) {
        var result = getStage(id);
        return convertObject(result, StageResponse.class);
    }

    private Stage getStage(Long id) {
        return projectStageRepo.findById(id).orElseThrow(throwNotFoundException(id, STAGE));
    }

    /**
     * @param pageNo
     * @param pageSize
     * @param keyword
     * @return
     */
    @Override
    public PaginationResponse<StageResponse> getAll(int pageNo, int pageSize, String keyword) {
        var pageable = PageRequest.of(pageNo, pageSize);
        var result = this.projectStageRepo.findAll(pageable);
        return getPaginationResponse(result, StageResponse.class);
    }

    /**
     * @return
     */
    @Override
    public List<StageResponse> getAll() {
        var result = this.projectStageRepo.findAll();
        return convertList(result, StageResponse.class);
    }

    /**
     * @param id
     */
    @Override
    public void delete(Long id) {
        var result = getStage(id);
        result.setActive(false);
        this.projectStageRepo.save(result);
    }
}
