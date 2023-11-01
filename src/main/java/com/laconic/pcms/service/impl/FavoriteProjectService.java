package com.laconic.pcms.service.impl;

import com.laconic.pcms.entity.FavoriteProject;
import com.laconic.pcms.repository.IFavoriteProjectRepo;
import com.laconic.pcms.repository.IProjectRepo;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.service.concrete.IFavoriteProjectService;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import org.springframework.stereotype.Service;

import static com.laconic.pcms.constants.AppMessages.PROJECT;
import static com.laconic.pcms.constants.AppMessages.USER;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class FavoriteProjectService implements IFavoriteProjectService {
    private final IProjectRepo projectRepo;
    private final IFavoriteProjectRepo favoriteProjectRepo;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;

    public FavoriteProjectService(IProjectRepo projectRepo, IFavoriteProjectRepo favoriteProjectRepo, KeyCloakAuthenticationUtil keyCloakAuthenticationUtil) {
        this.projectRepo = projectRepo;
        this.favoriteProjectRepo = favoriteProjectRepo;
        this.keyCloakAuthenticationUtil = keyCloakAuthenticationUtil;
    }

    @Override
    public void addToFavorite(Long projectId) {
        var user = keyCloakAuthenticationUtil.getUser();
        var existing = this.favoriteProjectRepo.findByUserIdAndProjectId(user.getId(), projectId).isPresent();
        if (!existing) {
            var project = this.projectRepo.findById(projectId).orElseThrow(throwNotFoundException(projectId, PROJECT));
            this.favoriteProjectRepo.save(FavoriteProject.builder().user(user).project(project).build());
        }
    }

    @Override
    public void removeFromFavorite(Long projectId) {
        var user = keyCloakAuthenticationUtil.getUser();
        var favProject = this.favoriteProjectRepo.findByUserIdAndProjectId(user.getId(), projectId).orElseThrow(
                throwNotFoundException(user.getId(), projectId, PROJECT, USER));
        this.favoriteProjectRepo.delete(favProject);
    }
}
