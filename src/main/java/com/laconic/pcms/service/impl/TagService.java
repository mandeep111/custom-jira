package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.Tag;
import com.laconic.pcms.repository.ITagRepo;
import com.laconic.pcms.request.TagRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.TagResponse;
import com.laconic.pcms.service.concrete.ITagService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.laconic.pcms.constants.AppMessages.TAG;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class TagService implements ITagService {
    private final ITagRepo projectTagRepo;
    private final CommonComponent commonComponent;


    public TagService(ITagRepo projectTagRepo, CommonComponent commonComponent) {
        this.projectTagRepo = projectTagRepo;
        this.commonComponent = commonComponent;
    }

    @Override
    public void save(TagRequest request) {
        var projectTag = convertObject(request, Tag.class);
        this.projectTagRepo.save(projectTag);
    }

    @Override
    public void update(TagRequest request, Long id) {
        var tag = getTag(id);
        tag.setName(request.getName());
        tag.setDescription(request.getDescription());
        this.projectTagRepo.save(tag);
    }

    @Override
    public TagResponse getById(Long id) {
        var result = getTag(id);
        return convertObject(result, TagResponse.class);
    }

    private Tag getTag(Long id) {
        return projectTagRepo.findById(id).orElseThrow(throwNotFoundException(id, TAG));
    }

    @Override
    public PaginationResponse<TagResponse> getAll(int pageNo, int pageSize, String keyword) {
        var pageable = PageRequest.of(pageNo, pageSize);
        var result = this.projectTagRepo.findAll(pageable);
        return getPaginationResponse(result, TagResponse.class);
    }

    @Override
    public List<TagResponse> getAll() {
        var result = this.projectTagRepo.findAll();
        return convertList(result, TagResponse.class);
    }

    @Override
    public void delete(Long id) {
        var result = getTag(id);
        result.setActive(false);
        this.projectTagRepo.save(result);
    }
}