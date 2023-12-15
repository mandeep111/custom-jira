package com.laconic.pcms.service.concrete;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.request.UserLoginRequest;
import com.laconic.pcms.response.JWTAuthResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.UserResponse;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.security.oauth2.jwt.Jwt;

import java.io.IOException;
import java.util.List;

public interface IUserService {
    void save(Jwt jwt, UserLoginRequest request) throws IOException, UnirestException;

    void update(Jwt jwt, UserLoginRequest userLoginRequest, Long id) throws UnirestException, JsonProcessingException;

    UserResponse getById(Long id);

    UserResponse getByEmail(String email);

    PaginationResponse<UserResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);

    List<UserResponse> getAll();

    List<UserResponse> getAllBySpace(Long spaceId);

    List<UserResponse> getAllByTask(Long taskId);
}
