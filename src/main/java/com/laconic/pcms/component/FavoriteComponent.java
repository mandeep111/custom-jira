package com.laconic.pcms.component;

import com.laconic.pcms.repository.IFavoriteProjectRepo;
import com.laconic.pcms.repository.IFavoriteSpaceRepo;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.SpaceResponse;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FavoriteComponent {
    private final IFavoriteSpaceRepo favoriteSpaceRepo;
    private final IFavoriteProjectRepo favoriteProjectRepo;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;

    public Boolean getIsFavoriteSpace(Long id) {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        return this.favoriteSpaceRepo.findByUserIdAndSpaceId(currentUser.getId(), id).isPresent();
    }

    public List<SpaceResponse> mapFavoriteSpaces(List<SpaceResponse> responses) {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        var favoriteSpaces = this.favoriteSpaceRepo.findAllByUserId(currentUser.getId());
        return responses.stream()
                .peek(space -> space.setIsFavorite(favoriteSpaces.stream().anyMatch(fp -> fp.getSpace().getId().equals(space.getId())))).toList();
    }

    public Boolean getIsFavoriteProject(Long id) {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        return this.favoriteProjectRepo.findByUserIdAndProjectId(currentUser.getId(), id).isPresent();
    }

    public List<ProjectResponse> mapFavoriteProjects(List<ProjectResponse> responses) {
        var currentUser = keyCloakAuthenticationUtil.getUser();
        var favoriteProjects = this.favoriteProjectRepo.findAllByUserId(currentUser.getId());
        return responses.stream()
                .peek(project -> project.setIsFavorite(favoriteProjects.stream()
                        .anyMatch(fp -> fp.getProject().getId().equals(project.getId())))
                ).sorted(Comparator.comparing(ProjectResponse::getIsFavorite, Comparator.reverseOrder())).toList();
        /*return responses.stream()
                .peek(project -> project.setIsFavorite(favoriteProjects.stream().anyMatch(fp -> fp.getProject().getId().equals(project.getId())))).toList();*/
    }

}
