package com.laconic.pcms.controller;


import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.UserLoginRequest;
import com.laconic.pcms.response.PaginationResponse;
import com.laconic.pcms.response.SpaceResponse;
import com.laconic.pcms.response.UserResponse;
import com.laconic.pcms.service.concrete.ISpaceService;
import com.laconic.pcms.service.concrete.IUserService;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.laconic.pcms.component.KeyCloakComponent.getEmailFromToken;
import static com.laconic.pcms.constants.AppConstants.*;
import static com.laconic.pcms.utils.KeyCloakAuthenticationUtil.getUserEmail;

@RestController
@RequestMapping(Routes.user)
@RequiredArgsConstructor
public class UserController {
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;
    private final IUserService userService;
    private final ISpaceService spaceService;

    @PostMapping
    public void save(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody UserLoginRequest request) {
        try {
            this.userService.save(jwt, request);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping(Routes.update)
    public void update(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody UserLoginRequest userLoginRequest, @PathVariable("id") Long id) {
        try {
            this.userService.update(jwt, userLoginRequest, id);
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping(Routes.page)
    public ResponseEntity<PaginationResponse<UserResponse>> getAll(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                   @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                   @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                                                   @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                   @RequestParam(value = "search", required = false) String keyword,
                                                                   @RequestParam(value = "searchAttributes", required = false) List<String> searchAttributes) {

        return ResponseEntity.ok(this.userService.getAll(pageNo, pageSize, sortBy, sortDir, keyword, searchAttributes));
    }

    @GetMapping(Routes.list)
    public ResponseEntity<List<UserResponse>> getAll() {
        return ResponseEntity.ok(this.userService.getAll());
    }

    @GetMapping("/all-by-space/{spaceId}")
    public ResponseEntity<List<UserResponse>> getAllBySpace(@PathVariable("spaceId") Long spaceId) {
        return ResponseEntity.ok(this.userService.getAllBySpace(spaceId));
    }

    @GetMapping("/all-by-task/{taskId}")
    public ResponseEntity<List<UserResponse>> getAllByTask(@PathVariable("taskId") Long taskId) {
        return ResponseEntity.ok(this.userService.getAllByTask(taskId));
    }

    @GetMapping(Routes.getById)
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.userService.getById(id));
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserResponse> getById(@PathVariable String email) {
        return ResponseEntity.ok(this.userService.getByEmail(email));
    }

    @GetMapping("/my-space")
    public ResponseEntity<PaginationResponse<SpaceResponse>> getAllSpaces(@AuthenticationPrincipal Jwt jwt, @RequestParam(value = "pageNo", defaultValue = DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                          @RequestParam(value = "pageSize", defaultValue = DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                          @RequestParam(value = "sortBy", defaultValue = DEFAULT_SORT_BY, required = false) String sortBy,
                                                                          @RequestParam(value = "sortDir", defaultValue = DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                          @RequestParam(value = "search", required = false) String keyword) {
        return ResponseEntity.ok(this.spaceService.getAll(getEmailFromToken(jwt.getTokenValue()), pageNo, pageSize, sortBy, sortDir, keyword));
    }
}
