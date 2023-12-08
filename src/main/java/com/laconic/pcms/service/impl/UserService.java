package com.laconic.pcms.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.KeyCloakComponent;
import com.laconic.pcms.component.authentication.JwtTokenProvider;
import com.laconic.pcms.dto.CreateUserDto;
import com.laconic.pcms.dto.UpdatePassword;
import com.laconic.pcms.dto.UpdateUserDto;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.request.UserLoginRequest;
import com.laconic.pcms.response.JWTAuthResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.UserResponse;
import com.laconic.pcms.service.concrete.IUserService;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import com.mashape.unirest.http.exceptions.UnirestException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

import static com.laconic.pcms.component.KeyCloakComponent.*;
import static com.laconic.pcms.constants.AppMessages.*;
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
    private final KeyCloakComponent keyCloakComponent;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;

    public UserService(IUserRepo userRepo, BCryptPasswordEncoder encoder, CommonComponent commonComponent, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, KeyCloakComponent keyCloakComponent, KeyCloakAuthenticationUtil keyCloakAuthenticationUtil) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.commonComponent = commonComponent;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.keyCloakComponent = keyCloakComponent;
        this.keyCloakAuthenticationUtil = keyCloakAuthenticationUtil;
    }

    @Override
    @Transactional
    public void save(Jwt jwt, UserLoginRequest request) throws IOException {
        var password = encoder.encode(request.getPassword());
        // save in keycloak first
        try {
            var user = User.builder()
                    .fullName(request.getEmail())
                    .password(password)
                    .email(request.getEmail())
                    .build();

            keyCloakComponent.signup(mapToKeycloakUser(user, request.getPassword(), request.getDefaultPage()), jwt);
            this.userRepo.save(user);
        } catch (JsonProcessingException | UnirestException e) {
            throw new PreconditionFailedException(e.getMessage());
        }

    }
/*    public void save(Jwt jwt, CreateUserDto request) throws IOException {
        var password = encoder.encode(extractPassword(request.getCredentials()));
        // save in keycloak first
        try {
            keyCloakComponent.signup(request, jwt);
            this.userRepo.save(User.builder()
                    .fullName(request.getEmail())
                    .password(password)
                    .email(request.getEmail())
                    .build());
        } catch (JsonProcessingException | UnirestException e) {
            throw new PreconditionFailedException(e.getMessage());
        }

    }*/
/*
    public void save(UserLoginRequest request) {
        var password = encoder.encode(request.getPassword());
        this.userRepo.save(User.builder()
                .fullName(request.getEmail())
                .password(password)
                .email(request.getEmail())
                .build());

    }
*/

    @Override
    @Transactional
    public void update(Jwt jwt, UserLoginRequest userLoginRequest, Long id) throws UnirestException, JsonProcessingException {
        var name = splitFullName(userLoginRequest.getFullName());
        var updateKeyCloakUser = UpdateUserDto.builder().id(jwt.getSubject()).emailVerified(true).email(userLoginRequest.getEmail())
                .firstName(name[0]).lastName(name[1]).build();
        var status = keyCloakComponent.updateUserInformation(updateKeyCloakUser);
        if (!status) throw new PreconditionFailedException("Something went wrong in keycloak");
        var user = this.userRepo.findById(id).orElseThrow(throwNotFoundException(id, USER));;
        user.setEmail(user.getEmail());
        user.setFullName(user.getFullName());
        this.userRepo.saveAndFlush(user);
    }

    @Override
    @Transactional
    public void updatePassword(Jwt jwt, String newPassword) throws UnirestException, JsonProcessingException {
        String email = getEmailFromToken(jwt.getTokenValue());
        String id = jwt.getSubject();
        var status = keyCloakComponent.updatePassword(new UpdatePassword("password", newPassword, false), id);
        if (!status) throw new PreconditionFailedException("Something went wrong in keycloak");
        var user = this.userRepo.findByEmail(email).orElseThrow(throwNotFoundException(email, USER, "EMAIL"));;
        user.setEmail(user.getEmail());
        user.setFullName(user.getFullName());
        this.userRepo.saveAndFlush(user);
    }

    @Override
    public UserResponse getById(Long id) {
        var result = commonComponent.getEntity(id, User.class, USER);
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
        Page<User> page;
        if (keyword != null) {
            var specs = CommonComponent.getSpecification(User.class, USER, keyword, searchAttributes);
            page = this.userRepo.findAll(specs, pageable);
        } else page = this.userRepo.findAll(pageable);
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
        var user = keyCloakAuthenticationUtil.getUser();
        Date expirationDate = tokenProvider.getExpirationDateFromToken(token);
        System.out.println("TOKEN : " + token);
        return JWTAuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullname(user.getFullName())
                .lastLogin(new Date())
                .expirationDate(expirationDate)
                .token(token)
                .build();
    }

    @Override
    public List<UserResponse> getAllBySpace(Long spaceId) {
        var result = this.userRepo.findAllBySpaces_Id(spaceId);
        return convertList(result, UserResponse.class);
    }

    @Override
    public List<UserResponse> getAllByTask(Long taskId) {
        var result = this.userRepo.findAllByTasks_Id(taskId);
        return convertList(result, UserResponse.class);
    }

}
