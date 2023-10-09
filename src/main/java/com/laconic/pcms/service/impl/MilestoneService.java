package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.Milestone;
import com.laconic.pcms.repository.IMilestoneRepo;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.request.MileStoneRequest;
import com.laconic.pcms.response.MileStoneResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.IMilestoneService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.MAIL_TEMPLATE;
import static com.laconic.pcms.constants.AppMessages.PROJECT;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class MilestoneService implements IMilestoneService {
    private final IMilestoneRepo milestoneRepo;
    private final IProjectRepo projectRepo;
    private final CommonComponent commonComponent;

    public MilestoneService(IMilestoneRepo milestoneRepo, IProjectRepo projectRepo, CommonComponent commonComponent) {
        this.milestoneRepo = milestoneRepo;
        this.projectRepo = projectRepo;
        this.commonComponent = commonComponent;
    }

    @Override
    public void save(MileStoneRequest request) {
        var project = this.projectRepo.findById(request.getProjectId()).orElseThrow(throwNotFoundException(request.getProjectId(), PROJECT));
        var milestone = convertObject(request, Milestone.class);
        milestone.setProject(project);
        this.milestoneRepo.save(milestone);
    }

    @Override
    public void update(MileStoneRequest request) {

    }

    @Override
    public MileStoneResponse getById(Long id) {
        var result = commonComponent.getEntity(id, Milestone.class, MAIL_TEMPLATE);
        return convertObject(result, MileStoneResponse.class);
    }

    @Override
    public PaginationResponse<MileStoneResponse> getAll(int pageNo, int pageSize, String keyword) {
        var pageable = PageRequest.of(pageNo, pageSize);
        var result = this.milestoneRepo.findAll(pageable);
        return getPaginationResponse(result, MileStoneResponse.class);
    }

    @Override
    public List<MileStoneResponse> getAll() {
        var result = this.milestoneRepo.findAll();
        return convertList(result, MileStoneResponse.class);
    }

    /**
     * @param id
     */
    @Override
    public void delete(Long id) {
        var result = commonComponent.getEntity(id, Milestone.class, MAIL_TEMPLATE);
        result.setActive(false);
        this.milestoneRepo.save(result);
    }
}
