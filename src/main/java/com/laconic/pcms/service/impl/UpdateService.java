package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.ProjectUpdate;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.IUpdateRepo;
import com.laconic.pcms.request.UpdateRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.UpdateResponse;
import com.laconic.pcms.service.concrete.IUpdateService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

import static com.laconic.pcms.constants.AppMessages.UPDATE;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class UpdateService implements IUpdateService {
    private final CommonComponent commonComponent;
    private final IUpdateRepo projectUpdateRepo;
    private final IProjectRepo projectRepo;

    public UpdateService(CommonComponent commonComponent, IUpdateRepo projectUpdateRepo, IProjectRepo projectRepo) {
        this.commonComponent = commonComponent;
        this.projectUpdateRepo = projectUpdateRepo;
        this.projectRepo = projectRepo;
    }

    @Override
    @Transactional
    public void save(UpdateRequest request) {
        var project = commonComponent.getEntity(request.getProjectId(), Project.class, UPDATE);
        var projectUpdate = convertObject(request, ProjectUpdate.class);
        projectUpdate.setProject(project);
        projectUpdate = this.projectUpdateRepo.saveAndFlush(projectUpdate);

        // also update status in project
        project.setLastUpdateId(projectUpdate.getId());
        project.setLastUpdateStatus(projectUpdate.getStatus());
        this.projectRepo.save(project);
    }

    @Override
    @Transactional
    public void update(UpdateRequest request, Long id) {
        var projectUpdate = this.projectUpdateRepo.findById(id).orElseThrow(throwNotFoundException(id, UPDATE));
        projectUpdate.setName(request.getName());
        projectUpdate.setStatus(request.getStatus());
        projectUpdate.setDescription(request.getDescription());
        projectUpdate.setActive(request.getIsActive());
        this.projectUpdateRepo.saveAndFlush(projectUpdate);
        var project = commonComponent.getEntity(request.getProjectId(), Project.class, UPDATE);
        if (Objects.equals(project.getLastUpdateId(), id)) {
            project.setLastUpdateStatus(request.getStatus());
            this.projectRepo.save(project);
        }
    }

    @Override
    public UpdateResponse getById(Long id) {
        var result = commonComponent.getEntity(id, ProjectUpdate.class, UPDATE);
        return convertObject(result, UpdateResponse.class);
    }

    @Override
    public PaginationResponse<UpdateResponse> getAll(int pageNo, int pageSize, String keyword) {
        var pageable = PageRequest.of(pageNo, pageSize);
        var result = this.projectUpdateRepo.findAll(pageable);
        return getPaginationResponse(result, UpdateResponse.class);
    }

    @Override
    public PaginationResponse<UpdateResponse> getAllByProject(int pageNo, int pageSize, Long projectId) {
        var pageable = PageRequest.of(pageNo, pageSize);
        var result = this.projectUpdateRepo.findAllByProject_Id(projectId, pageable);
        return getPaginationResponse(result, UpdateResponse.class);
    }


    @Override
    public List<UpdateResponse> getAll() {
        var result = this.projectUpdateRepo.findAll();
        return convertList(result, UpdateResponse.class);
    }

    @Override
    public void delete(Long id) {
        var result = commonComponent.getEntity(id, ProjectUpdate.class, UPDATE);
        result.setActive(false);
        this.projectUpdateRepo.save(result);
    }
}