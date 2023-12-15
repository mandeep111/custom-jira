package com.laconic.pcms.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laconic.pcms.component.CommonComponent;
import com.laconic.pcms.component.KeyCloakComponent;
import com.laconic.pcms.dto.UpdateUserDto;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.exceptions.NotFoundException;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.ResetPasswordRequest;
import com.laconic.pcms.request.UserLoginRequest;
import com.laconic.pcms.response.KeycloakUserResponse;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.UserResponse;
import com.laconic.pcms.service.concrete.IUserService;
import com.mashape.unirest.http.exceptions.UnirestException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

import static com.laconic.pcms.component.KeyCloakComponent.mapToKeycloakUser;
import static com.laconic.pcms.component.KeyCloakComponent.splitFullName;
import static com.laconic.pcms.constants.AppMessages.USER;
import static com.laconic.pcms.utils.AutoMapper.convertList;
import static com.laconic.pcms.utils.AutoMapper.convertObject;
import static com.laconic.pcms.utils.Common.getPageable;
import static com.laconic.pcms.utils.CommonMapper.getPaginationResponse;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Service
public class UserService implements IUserService {
    private final IUserRepo userRepo;
    private final CommonComponent commonComponent;
    private final KeyCloakComponent keyCloakComponent;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(IUserRepo userRepo,CommonComponent commonComponent, KeyCloakComponent keyCloakComponent, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepo = userRepo;
        this.commonComponent = commonComponent;
        this.keyCloakComponent = keyCloakComponent;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    @Transactional
    public void save(Jwt jwt, UserLoginRequest request) throws IOException {
        var password = bCryptPasswordEncoder.encode(request.getPassword());
        try {
            var user = User.builder().fullName(request.getEmail()).password(password).email(request.getEmail()).build();
            keyCloakComponent.signup(mapToKeycloakUser(user, request.getPassword()), jwt);
            this.userRepo.save(user);
        } catch (JsonProcessingException | UnirestException e) {
            throw new PreconditionFailedException(e.getMessage());
        }
    }

    @Override
    @Transactional
    public void update(Jwt jwt, UserLoginRequest request, Long id) throws UnirestException, JsonProcessingException {
        var name = splitFullName(request.getFullName());
        var userOptional = userRepo.findById(id);

        if (userOptional.isPresent()) {
            var user = userOptional.get();
            user.setEmail(request.getEmail());
            user.setFullName(request.getFullName());
            user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));

            var ssoId = keyCloakComponent.getUserById(jwt, user.getSsoId()).getBody();
            ObjectMapper objectMapper = new ObjectMapper();
            KeycloakUserResponse keycloakUserResponse = objectMapper.readValue(ssoId, KeycloakUserResponse.class);
            var keycloakUser = UpdateUserDto.builder()
                    .id(keycloakUserResponse.getId())
                    .firstName(name[0])
                    .lastName(name[1])
                    .username(keycloakUserResponse.getUsername())
                    .email(keycloakUserResponse.getEmail())
                    .build();
            keyCloakComponent.updateUserInformation(jwt, keycloakUser);
            ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
            resetPasswordRequest.setValue(request.getPassword());
            keyCloakComponent.resetPassword(jwt, keycloakUserResponse.getId(), resetPasswordRequest);
        } else {
            throw new NotFoundException("User not found with id: " + id);
        }
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
