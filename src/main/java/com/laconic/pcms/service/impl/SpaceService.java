package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.entity.Project;
import com.laconic.pcms.entity.Space;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.ISpaceRepo;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.IdRequest;
import com.laconic.pcms.request.SpaceRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SpaceResponse;
import com.laconic.pcms.service.concrete.ISpaceService;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.laconic.pcms.constants.AppMessages.SPACE;
import static com.laconic.pcms.utils.AuthenticationUtil.getCurrentUser;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class SpaceService implements ISpaceService {
    private final ISpaceRepo spaceRepo;
    private final IUserRepo userRepo;
    private final IProjectRepo projectRepo;
    private final CommonComponent commonComponent;

    public SpaceService(ISpaceRepo spaceRepo, IUserRepo userRepo, IProjectRepo projectRepo, CommonComponent commonComponent) {
        this.spaceRepo = spaceRepo;
        this.userRepo = userRepo;
        this.projectRepo = projectRepo;
        this.commonComponent = commonComponent;
    }

    @Override
    public void save(SpaceRequest request) {
        var space = convertObject(request, Space.class);
        List<User> users = new ArrayList<>();
        var currentUser= getCurrentUser();
        // private user can not add other assignee
        if (!request.getIsPrivate()) {
            users.addAll(this.userRepo.findAllById(request.getUserIds().stream().map(IdRequest::id).toList()));
        } else if(!request.getUserIds().isEmpty()) {
            throw new PreconditionFailedException("Private Space can not have assignee");
        }
        // check if current user is added or not
        if (users.stream().noneMatch(u -> u.getId().equals(currentUser.getId()))) {
            users.add(currentUser);
        }
        space.setUsers(users); // add currently logged-in user
        this.spaceRepo.save(space);
    }

    @Override
    public void update(SpaceRequest request, Long id) {
        var space = getSpace(id);
        space.setIsPrivate(request.getIsPrivate());
        space.setTags(request.getTags());
        space.setColor(request.getColor());
        space.setUrl(request.getUrl());
        this.spaceRepo.save(space);
    }

    @Override
    public PaginationResponse<SpaceResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var page = commonComponent.findAllEntities(Space.class, SPACE, keyword, searchAttributes, pageable);
        return getPaginationResponse(page, SpaceResponse.class);
    }

    @Override
    public List<SpaceResponse> getAll() {
        var result = this.spaceRepo.findAll();
        return convertList(result, SpaceResponse.class);
    }

    @Override
    public SpaceResponse getById(Long id) {
        Space result = getSpace(id);
        return convertObject(result, SpaceResponse.class);
    }

    @Override
    public void addAssignee(Long spaceId, List<Long> userIds) {
        var users = this.userRepo.findAllById(userIds);
        Space space = getSpace(spaceId);
        Set<User> existingUsers = new HashSet<>(space.getUsers());
        existingUsers.addAll(users);
        space.setUsers(new ArrayList<>(existingUsers));
        this.spaceRepo.save(space);
    }

    private Space getSpace(Long spaceId) {
        return this.spaceRepo.findById(spaceId).orElseThrow(throwNotFoundException(spaceId, SPACE));
    }

    @Override
    public void removeAssignee(Long spaceId, List<Long> userIds) {
        Space space = getSpace(spaceId);
        var users = this.userRepo.findAllById(userIds);
        Set<User> existingUsers = new HashSet<>(space.getUsers());
        users.forEach(existingUsers::remove);
        space.setUsers(new ArrayList<>(existingUsers));
        this.spaceRepo.save(space);
    }

    @Override
    public void removeProjects(Long spaceId, List<Long> projectIds) {
        Space space = getSpace(spaceId);
        var projects = this.projectRepo.findAllById(projectIds);
        Set<Project> existingProjects = new HashSet<>(space.getProjects());
        projects.forEach(existingProjects::remove);
        space.setProjects(new ArrayList<>(existingProjects));
        this.spaceRepo.save(space);
    }

    @Override
    public PaginationResponse<SpaceResponse> getAll(String email, int pageNo, int pageSize, String sortBy, String sortDir, String keyword) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        Page<Space> page;
        if (keyword != null) {
            page = this.spaceRepo.findAll(getByUserEmail(email).and(getBySpaceName(keyword)), pageable);
        } else page = this.spaceRepo.findAllByUsers_EmailEqualsIgnoreCase(email, pageable);
        return getPaginationResponse(page, SpaceResponse.class);
    }

    @Override
    public SpaceResponse getByUrl(Long id, String url) {
        var result = this.spaceRepo.findByIdAndUrlEqualsIgnoreCase(id, url).orElseThrow(throwNotFoundException(id+ ", " + url, SPACE, "ID AND URL"));
        return convertObject(result, SpaceResponse.class);
    }

    public static Specification<Space> getBySpaceName(String spaceName) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), "%"+spaceName.toLowerCase().trim()+"%");
    }

    public static Specification<Space> getByUserEmail(String userEmail) {
        return (root, query, cb) -> {
            root.join("users");
            return cb.equal(root.get("users").get("email"), userEmail);
        };
    }
}
