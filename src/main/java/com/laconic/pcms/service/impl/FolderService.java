package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.FolderComponent;
import com.laconic.pcms.entity.*;
import com.laconic.pcms.repository.IFolderRepo;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.ISubTaskRepo;
import com.laconic.pcms.repository.ITaskRepo;
import com.laconic.pcms.request.FolderRequest;
import com.laconic.pcms.response.*;
import com.laconic.pcms.service.concrete.IFolderService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class FolderService implements IFolderService {
    private final CommonComponent commonComponent;
    private final IFolderRepo folderRepo;
    private final FolderComponent folderComponent;
    private final IProjectRepo projectRepo;
    private final ITaskRepo taskRepo;
    private final ISubTaskRepo subTaskRepo;

    public FolderService(CommonComponent commonComponent, IFolderRepo folderRepo, FolderComponent folderComponent, IProjectRepo projectRepo, ITaskRepo taskRepo, ISubTaskRepo subTaskRepo) {
        this.commonComponent = commonComponent;
        this.folderRepo = folderRepo;
        this.folderComponent = folderComponent;
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
        this.subTaskRepo = subTaskRepo;
    }

    @Override
    public void save(FolderRequest request) {
        var space = this.commonComponent.getEntity(request.spaceId(), Space.class, SPACE);
        this.folderRepo.save(Folder.builder()
                .color(request.color())
                .description(request.description())
                .name(request.name())
                .space(space)
                .build());
    }

    @Override
    public void update(FolderRequest request, Long id) {
        var folder = getFolder(id);
        folder.setName(request.name());
        folder.setDescription(request.description());
        folder.setColor(request.color());
        this.folderRepo.save(folder);
    }

    @Override
    public void delete(Long id) {
        var result = getFolder(id);
        List<Project> projects = this.projectRepo.findAllByFolderId(id);
        for (Project project : projects) {
            project.setFolder(null);
        }
        this.projectRepo.saveAll(projects);
        result.setActive(false);
        this.folderRepo.save(result);
    }

    @Override
    public PaginationResponse<FolderResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, Long spaceId, String keyword) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<Folder> page;
        if (keyword != null) {
            var specs = CommonComponent.getSpecification(Folder.class, FOLDER, keyword, null);
            page = this.folderRepo.findAll(specs, pageable);
        } else {
            if (spaceId != null) {
                page = this.folderRepo.findBySpaceId(spaceId, pageable);
            } else {
                page = this.folderRepo.findAll(pageable);
            }
        }
        return getPaginationResponse(page, FolderResponse.class);
    }

    @Override
    public FolderResponse getById(Long id) {
        var _folder = getFolder(id);
        return folderComponent.getFolderResponse(_folder);
    }

    @Override
    public FolderResponse rename(Long id, String name) {
        var folder = getFolder(id);
        folder.setName(name);
        folder = this.folderRepo.saveAndFlush(folder);
        return convertObject(folder, FolderResponse.class);
    }

    @Override
    public FolderResponse moveFolder(Long id, Long spaceId) {
        var data = getFolder(id);
        var space = this.commonComponent.getEntity(spaceId, Space.class, SPACE);
        List<Project> projects = this.projectRepo.findAllByFolderId(id);
        for (Project project : projects) {
            project.setSpace(space);
        }
        data.setSpace(space);
        data = this.folderRepo.save(data);
        return convertObject(data, FolderResponse.class);
    }

    private Folder getFolder(Long id) {
        return this.folderRepo.findById(id).orElseThrow(throwNotFoundException(id, FOLDER));
    }
}
