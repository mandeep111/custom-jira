package com.laconic.pcms.service.impl;

import com.laconic.pcms.entity.FavoriteSpace;
import com.laconic.pcms.repository.IFavoriteSpaceRepo;
import com.laconic.pcms.repository.ISpaceRepo;
import com.laconic.pcms.service.concrete.IFavoriteSpaceService;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import org.springframework.stereotype.Service;

import static com.laconic.pcms.constants.AppMessages.SPACE;
import static com.laconic.pcms.constants.AppMessages.USER;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class FavoriteSpaceService implements IFavoriteSpaceService {
    private final ISpaceRepo spaceRepo;
    private final IFavoriteSpaceRepo favoriteSpaceRepo;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;

    public FavoriteSpaceService(ISpaceRepo spaceRepo, IFavoriteSpaceRepo favoriteSpaceRepo, KeyCloakAuthenticationUtil keyCloakAuthenticationUtil) {
        this.spaceRepo = spaceRepo;
        this.favoriteSpaceRepo = favoriteSpaceRepo;
        this.keyCloakAuthenticationUtil = keyCloakAuthenticationUtil;
    }

    @Override
    public void addToFavorite(Long spaceId) {
        var user = keyCloakAuthenticationUtil.getUser();
        var existing = this.favoriteSpaceRepo.findByUserIdAndSpaceId(user.getId(), spaceId).isPresent();
        if (!existing) {
            var space = this.spaceRepo.findById(spaceId).orElseThrow(throwNotFoundException(spaceId, SPACE));
            this.favoriteSpaceRepo.save(FavoriteSpace.builder().user(user).space(space).build());
        }
    }

    @Override
    public void removeFromFavorite(Long spaceId) {
        var user = keyCloakAuthenticationUtil.getUser();
        var favSpace = this.favoriteSpaceRepo.findByUserIdAndSpaceId(user.getId(), spaceId).orElseThrow(
                throwNotFoundException(user.getId(), spaceId, SPACE, USER));
        this.favoriteSpaceRepo.delete(favSpace);
    }
}
