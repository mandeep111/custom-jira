package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.FolderRequest;
import com.laconic.pcms.response.FolderResponse;
import com.laconic.pcms.response.PaginationResponse;

import java.util.List;

public interface IFolderService {
    void save(FolderRequest request);

    void update(FolderRequest request, Long id);

    void delete(Long id);

    PaginationResponse<FolderResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, Long spaceId, String keyword);

    FolderResponse getById(Long id);

    FolderResponse rename(Long id, String name);

    FolderResponse moveFolder(Long id, Long spaceId);
}
