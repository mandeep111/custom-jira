package com.laconic.pcms.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.laconic.pcms.component.KeyCloakComponent;
import com.laconic.pcms.exceptions.ServerException;
import com.laconic.pcms.request.ResetPasswordRequest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/keycloak")
public class KeycloakController {

    private final KeyCloakComponent keyCloakComponent;

    public KeycloakController(KeyCloakComponent keyCloakComponent) {
        this.keyCloakComponent = keyCloakComponent;
    }

    @GetMapping("/users")
    public ResponseEntity<String> getUser(@AuthenticationPrincipal Jwt jwt, @RequestParam(value = "user") String user) {
        try {
            return keyCloakComponent.getUser(jwt, user);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<String> getUserById(@AuthenticationPrincipal Jwt jwt, @PathVariable String userId) {
        try {
            return keyCloakComponent.getUserById(jwt, userId);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/users/logout/{userId}")
    public ResponseEntity<String> destroyAllSession(@AuthenticationPrincipal Jwt jwt, @PathVariable String userId) {
        try {
            return keyCloakComponent.destroyAllSession(jwt, userId);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        }
    }

    @PutMapping("/users/reset-password/{userId}")
    public ResponseEntity<String> resetPassword(@AuthenticationPrincipal Jwt jwt, @PathVariable String userId, ResetPasswordRequest resetPasswordRequest) {
        try {
            return keyCloakComponent.resetPassword(jwt, userId, resetPasswordRequest);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@AuthenticationPrincipal Jwt jwt, @PathVariable String userId) {
        try {
            return keyCloakComponent.deleteUser(jwt, userId);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        }
    }

    @GetMapping("/sessions/{userId}")
    public ResponseEntity<String> getSession(@AuthenticationPrincipal Jwt jwt, @PathVariable String userId) {
        try {
            return keyCloakComponent.getSession(jwt, userId);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<String> destroySession(@AuthenticationPrincipal Jwt jwt, @PathVariable String sessionId) {
        try {
            return keyCloakComponent.destroySession(jwt, sessionId);
        } catch (UnirestException e) {
            throw new ServerException(e.getMessage());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
