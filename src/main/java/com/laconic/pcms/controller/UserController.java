package com.laconic.pcms.controller;


import com.laconic.pcms.component.authentication.JwtTokenProvider;
import com.laconic.pcms.constants.AppConstants;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.request.UserLoginRequest;
import com.laconic.pcms.response.*;
import com.laconic.pcms.service.concrete.ISpaceService;
import com.laconic.pcms.service.concrete.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.laconic.pcms.constants.AppConstants.*;
import static com.laconic.pcms.constants.AppConstants.DEFAULT_SORT_DIRECTION;
import static com.laconic.pcms.utils.AuthenticationUtil.getCurrentUser;
import static com.laconic.pcms.utils.AuthenticationUtil.getCurrentUserName;

@RestController
@RequestMapping(Routes.user)
@RequiredArgsConstructor
public class UserController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final IUserService userService;
    private final ISpaceService spaceService;

    @PostMapping
    public void save(@Valid @RequestBody UserLoginRequest request) {
        try {
            this.userService.save(request);
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

    @GetMapping(Routes.getById)
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.userService.getById(id));
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserResponse> getById(@PathVariable String email) {
        return ResponseEntity.ok(this.userService.getByEmail(email));
    }

    // todo: user roles
    @PostMapping("/login")
    public ResponseEntity<JWTAuthResponse> authenticateUser(@RequestBody @Valid LoginDto loginDto) {
        try {
            return ResponseEntity.ok().body(this.userService.authenticateUserWithResponse(loginDto));
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PostMapping("/check-token")
    public ResponseEntity<TokenResponse> checkToken(@RequestBody TokenDto tokenDto) {
        String token = tokenDto.token();
        var response = tokenProvider.isTokenValid(token) ? "Ok" : "Expire";
        return ResponseEntity.ok(new TokenResponse(response));
    }

    @GetMapping("/my-space")
    public ResponseEntity<PaginationResponse<SpaceResponse>> getAllSpaces(@RequestParam(value = "pageNo", defaultValue = DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                                                          @RequestParam(value = "pageSize", defaultValue = DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                                                          @RequestParam(value = "sortBy", defaultValue = DEFAULT_SORT_BY, required = false) String sortBy,
                                                                          @RequestParam(value = "sortDir", defaultValue = DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                                                          @RequestParam(value = "search", required = false) String keyword) {
        var email = getCurrentUserName();
        System.out.println(email);
        return ResponseEntity.ok(this.spaceService.getAll(email, pageNo, pageSize, sortBy, sortDir, keyword));
    }
}
