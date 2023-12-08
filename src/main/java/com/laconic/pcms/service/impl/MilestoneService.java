package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.Milestone;
import com.laconic.pcms.event.MilestoneEvent;
import com.laconic.pcms.exceptions.NotFoundException;
import com.laconic.pcms.repository.IMilestoneRepo;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.request.MileStoneRequest;
import com.laconic.pcms.response.MileStoneResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.service.concrete.IMilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class MilestoneService implements IMilestoneService {

    @Autowired
    private ApplicationEventPublisher eventPublisher;
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
        var result = commonComponent.getEntity(id, Milestone.class, MILESTONE);
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

    @Override
    public PaginationResponse<MileStoneResponse> getAllByProjectId(int pageNo, int pageSize, String keyword, Long projectId) {
        var pageable = PageRequest.of(pageNo, pageSize);
        Page<Milestone> page;
        if (keyword != null) {
            page = this.milestoneRepo.findAllByProjectIdAndNameEqualsIgnoreCase(projectId, keyword, pageable);
        } else {
            page = this.milestoneRepo.findAllByProjectId(projectId, pageable);
        }
        return getPaginationResponse(page, MileStoneResponse.class);
    }

    @Override
    public void markAsReached(Long projectId, Long id) {
        var milestone = this.milestoneRepo.findByIdAndProjectId(id, projectId).orElseThrow(() -> new NotFoundException("Milestone not found with id: "+ id));
        milestone.setIsReached(true);
        var body = String.format("Project %s has reached %s milestone", milestone.getProject().getName(), milestone.getName());
        var subject = "Milestone Reached";
        var to = milestone.getProject().getUser().getEmail();
        var mileStoneEvent = new MilestoneEvent(to, subject, body);
        this.milestoneRepo.save(milestone);
        eventPublisher.publishEvent(mileStoneEvent);
    }
}
