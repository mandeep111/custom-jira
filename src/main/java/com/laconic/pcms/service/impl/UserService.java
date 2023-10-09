package com.laconic.pcms.service.impl;

import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.authentication.JwtTokenProvider;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.request.UserLoginRequest;
import com.laconic.pcms.response.JWTAuthResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.UserResponse;
import com.laconic.pcms.service.concrete.IUserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static com.laconic.pcms.constants.AppMessages.*;
import static com.laconic.pcms.utils.AuthenticationUtil.getCurrentUser;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class UserService implements IUserService {
    private final IUserRepo userRepo;
    private final BCryptPasswordEncoder encoder;
    private final CommonComponent commonComponent;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public UserService(IUserRepo userRepo, BCryptPasswordEncoder encoder, CommonComponent commonComponent, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.commonComponent = commonComponent;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void save(UserLoginRequest request) {
        var password = encoder.encode(request.getPassword());
        this.userRepo.save(User.builder()
                .fullName(request.getEmail())
                .password(password)
                .email(request.getEmail())
                .build());
    }

    @Override
    public UserResponse getById(Long id) {
        var result = commonComponent.getEntity(id, User.class, USER);
//        var result1 = commonComponent.findIdById(User.class, id, CUSTOMER);
//        System.out.println(result1);
        return convertObject(result, UserResponse.class);
    }

    @Override
    public UserResponse getByEmail(String email) {
        var result = this.userRepo.findByEmail(email).orElseThrow(throwNotFoundException(email, USER, "EMAIL"));
        return convertObject(result, UserResponse.class);
    }

    @Override
    public PaginationResponse<UserResponse> getAll(int pageNo, int pageSize, String sortBy, String sortDir, String keyword, List<String> searchAttributes) {
        var pageable = getPageable(pageNo, pageSize, sortBy, sortDir);
        var page = commonComponent.findAllEntities(User.class, USER, keyword, searchAttributes, pageable);
        return getPaginationResponse(page, UserResponse.class);
    }

    @Override
    public List<UserResponse> getAll() {
        var result = this.userRepo.findAll();
        return convertList(result, UserResponse.class);
    }

    @Override
    public JWTAuthResponse authenticateUserWithResponse(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.email(), loginDto.password()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        var user = getCurrentUser();
        Date expirationDate = tokenProvider.getExpirationDateFromToken(token);
        return JWTAuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullname(user.getFullName())
                .lastLogin(new Date())
                .expirationDate(expirationDate)
                .token(token)
                .build();
    }
}
