package com.laconic.pcms.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.laconic.pcms.component.KeyCloakComponent;
import com.laconic.pcms.dto.CreateUserDto;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.response.JWTAuthResponse;
import com.laconic.pcms.service.concrete.IUserService;
import com.mashape.unirest.http.exceptions.UnirestException;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/login")
public class LoginController {

    private final IUserService userService;
    private final KeyCloakComponent keyCloakComponent;
    public LoginController(IUserService userService, KeyCloakComponent keyCloakComponent) {
        this.userService = userService;
        this.keyCloakComponent = keyCloakComponent;
    }


    // db login
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<JWTAuthResponse> authenticateUser(@Valid LoginDto loginDto) {
        try {
            return ResponseEntity.ok().body(this.userService.authenticateUserWithResponse(loginDto));
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    // keycloak login
    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<JWTAuthResponse> login(@Valid LoginDto loginRequest) throws UnirestException {
        return keyCloakComponent.getAccessToken(loginRequest);
    }

    @PostMapping("/register")
    public void signUp(@AuthenticationPrincipal Jwt jwt, @RequestBody CreateUserDto dto) {
        try {
            keyCloakComponent.signup(dto, jwt);
        } catch (JsonProcessingException | UnirestException e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping("/logout")
    public boolean logout(@AuthenticationPrincipal Jwt jwt) {
        try {
            return keyCloakComponent.logout(jwt);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        }
    }
}
