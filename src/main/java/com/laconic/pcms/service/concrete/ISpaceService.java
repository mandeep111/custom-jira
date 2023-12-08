package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.SpaceRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SpaceResponse;

import java.util.List;

public interface ISpaceService {
    void save(SpaceRequest request);

    void update(SpaceRequest request, Long id);

    void delete(Long id);

    PaginationResponse<SpaceResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes, String email);

    List<SpaceResponse> getAll(String email);

    SpaceResponse getById(Long id, String email);
    SpaceResponse duplicate(Long id);

    void addAssignee(Long spaceId, List<Long> userIds);
//    String addProjects(Long spaceId, List<Long> projectIds);

    void removeAssignee(Long spaceId, List<Long> userIds);

    void removeProjects(Long spaceId, List<Long> projectIds);

    PaginationResponse<SpaceResponse> getAll(String email, int pageNo, int pageSize, String sortBy, String sortDir, String keyword);

    SpaceResponse getByUrlAndId(Long id, String url);
    SpaceResponse getByUrl(String url);

    SpaceResponse updateName(String name, Long id);

    SpaceResponse updateColor(String color, Long id);

}
