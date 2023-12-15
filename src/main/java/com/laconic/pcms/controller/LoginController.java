package com.laconic.pcms.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.laconic.pcms.component.KeyCloakComponent;
import com.laconic.pcms.dto.CreateUserDto;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.response.JWTAuthResponse;
import com.mashape.unirest.http.exceptions.UnirestException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
public class LoginController {

    private final KeyCloakComponent keyCloakComponent;

    public LoginController(KeyCloakComponent keyCloakComponent) {
        this.keyCloakComponent = keyCloakComponent;
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
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
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            return keyCloakComponent.logout(request);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        }
    }
}
