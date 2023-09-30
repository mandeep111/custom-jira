package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.SpaceRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SpaceResponse;

import java.util.List;

public interface ISpaceService {
    void save(SpaceRequest request);
    void update(SpaceRequest request, Long id);
    PaginationResponse<SpaceResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);
    List<SpaceResponse> getAll();
    SpaceResponse getById(Long id);
    void addAssignee(Long spaceId, List<Long> userIds);
//    String addProjects(Long spaceId, List<Long> projectIds);

    void removeAssignee(Long spaceId, List<Long> userIds);
    void removeProjects(Long spaceId, List<Long> projectIds);
    PaginationResponse<SpaceResponse> getAll(String email, int pageNo, int pageSize, String sortBy, String sortDir, String keyword);

    SpaceResponse getByUrl(Long id, String url);

}
