package com.laconic.pcms.service.concrete;

import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.request.UserLoginRequest;
import com.laconic.pcms.response.JWTAuthResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.UserResponse;

import java.util.List;

public interface IUserService {
    void save(UserLoginRequest userLoginRequest);
    UserResponse getById(Long id);
    UserResponse getByEmail(String email);

    PaginationResponse<UserResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes);
    List<UserResponse> getAll();
    JWTAuthResponse authenticateUserWithResponse(LoginDto loginDto);
}
