package com.laconic.pcms.component;

import com.laconic.pcms.entity.Folder;
import com.laconic.pcms.entity.Space;
import com.laconic.pcms.response.FolderResponse;
import com.laconic.pcms.response.ProjectResponse;
import com.laconic.pcms.response.SpaceResponse;
import com.laconic.pcms.utils.TaskUtil;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import static com.laconic.pcms.service.impl.TaskService.mapProgress;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;

@Component
public class FolderComponent {

    private final FavoriteComponent favoriteComponent;

    public FolderComponent(FavoriteComponent favoriteComponent) {
        this.favoriteComponent = favoriteComponent;
    }

    public FolderResponse getFolderResponse(Folder _folder) {
        var folder = convertObject(_folder, FolderResponse.class);
        var projectResponse = new HashSet<>(convertList(_folder.getProjects().stream().toList(), ProjectResponse.class));
        var response = favoriteComponent.mapFavoriteProjects(projectResponse.stream().toList());
//        response.forEach(r -> r.setTasks(mapProgress(r.getTasks())));

        // todo: need to change this implementation
        response.forEach(p -> p.setProgress(TaskUtil.getProjectProgress(p)));
        folder.setProjectResponses(new HashSet<>(response));
        return folder;
    }

    public List<FolderResponse> getFolderResponses(List<Folder> folders) {
        List<FolderResponse> folderResponse = new ArrayList<>();
        if (folders.isEmpty()) return folderResponse;
        folders.forEach(f -> folderResponse.add(getFolderResponse(f)));
        return folderResponse;
    }

    public void mapFolderResponse(List<Space> result, List<SpaceResponse> response) {
        for (int i = 0; i< result.size(); i++) {
            response.get(i).setFolders(getFolderResponses(result.get(i).getFolders().stream().toList()));
        }
    }

}
