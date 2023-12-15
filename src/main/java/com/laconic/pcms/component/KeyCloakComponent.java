package com.laconic.pcms.component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laconic.pcms.dto.CreateUserDto;
import com.laconic.pcms.dto.UpdatePassword;
import com.laconic.pcms.dto.UpdateUserDto;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.request.ResetPasswordRequest;
import com.laconic.pcms.response.JWTAuthResponse;
import com.laconic.pcms.response.KeycloakUserResponse;
import com.laconic.pcms.response.TokenResponse;
import com.laconic.pcms.utils.JsonFormatter;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import lombok.RequiredArgsConstructor;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class KeyCloakComponent {
    public static final String CONTENT_TYPE = "application/x-www-form-urlencoded";
    @Value("${keycloak.base.url}")
    private String baseUrl;

    @Value("${spring.security.oauth2.client.registration.keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.realm}")
    private String realm;

    private ObjectMapper objectMapper;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;
    private final IUserRepo userRepo;
    private final TokenResponse tokenResponse;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public void signup(CreateUserDto dto, Jwt jwt) throws JsonProcessingException, UnirestException {
        objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(dto);
        System.out.println(json);
        Unirest.setTimeouts(0, 0);
        var signUpUrl = baseUrl + "/admin/realms/test-realm/users";
        HttpResponse<String> response = Unirest.post(signUpUrl)
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .body(json)
                .asString();
        if (response.getStatus() != HttpStatus.CREATED.value()) {
            throw new PreconditionFailedException("Something went wrong.. " + response.getStatusText());
        }
        System.out.println(response);
    }

    public ResponseEntity<JWTAuthResponse> getAccessToken(LoginDto loginRequest) throws UnirestException {
        var tokenEndpoint = baseUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = null;

        if (loginRequest.grantType().equals("password")) {
            response = Unirest.post(tokenEndpoint)
                    .header("Content-Type", CONTENT_TYPE)
                    .field("client_id", clientId)
                    .field("username", loginRequest.email())
                    .field("password", loginRequest.password())
                    .field("grant_type", loginRequest.grantType())
                    .asString();
        } else if (loginRequest.grantType().equals("refresh_token")) {
            response = Unirest.post(tokenEndpoint)
                    .header("Content-Type", CONTENT_TYPE)
                    .field("client_id", clientId)
                    .field("refresh_token", tokenResponse.getRefreshToken())
                    .field("grant_type", loginRequest.grantType())
                    .asString();
        } else {
            throw new PreconditionFailedException("Grant type is invalid, should only be \"password\" or \"refresh_token\"");
        }

        if (response.getStatus() == HttpStatus.OK.value()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                AccessTokenResponse accessTokenResponse = objectMapper.readValue(response.getBody(), AccessTokenResponse.class);
                var user = keyCloakAuthenticationUtil.getKeyCloakUser(response.getBody());

                if (user.getId() == null) {
                    var url = baseUrl + "/admin/realms/" + realm + "/users?email=" + loginRequest.email();
                    Unirest.setTimeouts(0, 0);
                    HttpResponse<String> userRes = Unirest.get(url)
                            .header("Authorization", "Bearer " + accessTokenResponse.getToken())
                            .asString();
                    List<KeycloakUserResponse> keycloakUsers = objectMapper.readValue(userRes.getBody(), new TypeReference<List<KeycloakUserResponse>>() {
                    });
                    if (userRes.getStatus() == HttpStatus.OK.value() && !keycloakUsers.isEmpty()) {
                        KeycloakUserResponse keycloakUser = keycloakUsers.getFirst();
                        userRepo.saveAndFlush(User.builder()
                                .email(loginRequest.email())
                                .password(bCryptPasswordEncoder.encode(loginRequest.password()))
                                .fullName(keycloakUser.getFirstName() + " " + keycloakUser.getLastName())
                                .ssoId(keycloakUser.getId())
                                .build());
                    } else {
                        throw new PreconditionFailedException("User not found");
                    }
                }

                var expiryDate = getAccessTokenExpirationDate(accessTokenResponse.getToken());
                tokenResponse.setToken(accessTokenResponse.getToken());
                tokenResponse.setRefreshToken(accessTokenResponse.getRefreshToken());
                tokenResponse.setExpirationDate(expiryDate);
                return ResponseEntity.ok(new JWTAuthResponse(user.getId(), user.getEmail(), user.getFullName(), accessTokenResponse.getToken(), accessTokenResponse.getRefreshToken(), "bearer", new Date(), expiryDate, accessTokenResponse.getRefreshExpiresIn()));
            } catch (IOException e) {
                throw new PreconditionFailedException(e.getMessage());
            }
        } else if (response.getStatus() == HttpStatus.UNAUTHORIZED.value()) {
            throw new PreconditionFailedException("Incorrect email or password!");
        } else {
            throw new PreconditionFailedException("User not found!");
        }
    }

    public ResponseEntity<String> getUser(Jwt jwt, String users) throws UnirestException, JsonProcessingException {
        var url = baseUrl + "/admin/realms/" + realm + "/users?email=" + users;
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = Unirest.get(url)
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .asString();

        if (response.getStatus() == HttpStatus.OK.value()) {
            return ResponseEntity.ok(JsonFormatter.pretty(response.getBody()));
        } else {
            throw new PreconditionFailedException("user not found");
        }
    }

    public ResponseEntity<String> getUserById(Jwt jwt, String userId) throws UnirestException, JsonProcessingException {
        System.out.println(jwt);
        var url = baseUrl + "/admin/realms/" + realm + "/users/" + userId;
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = Unirest.get(url)
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .asString();
        KeycloakUserResponse keycloakUserResponse = new KeycloakUserResponse();
        if (response.getStatus() == HttpStatus.OK.value()) {
            return ResponseEntity.ok(JsonFormatter.pretty(response.getBody()));
        } else {
            throw new PreconditionFailedException(String.format("User ID %s not found", userId));
        }
    }

    public ResponseEntity<String> getSession(Jwt jwt, String usersId) throws UnirestException, JsonProcessingException {
        var url = baseUrl + "/admin/realms/" + realm + "/users/" + usersId + "/sessions";
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = Unirest.get(url)
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .asString();

        if (response.getStatus() == HttpStatus.OK.value()) {
            return ResponseEntity.ok(JsonFormatter.pretty(response.getBody()));
        } else {
            throw new PreconditionFailedException("Session not found!");
        }
    }

    public ResponseEntity<String> destroySession(Jwt jwt, String sessionId) throws UnirestException, JsonProcessingException {
        var url = baseUrl + "/admin/realms/" + realm + "/sessions/" + sessionId;
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = Unirest.delete(url)
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .asString();

        if (response.getStatus() == HttpStatus.NO_CONTENT.value()) {
            response.getHeaders().remove("Login");
            return ResponseEntity.ok("Session Logout Successfully!");
        } else {
            throw new PreconditionFailedException("Session not found!");
        }
    }

    public ResponseEntity<String> destroyAllSession(Jwt jwt, String userId) throws UnirestException {
        var url = baseUrl + "/admin/realms/" + realm + "/users/" + userId + "/logout";
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = Unirest.post(url)
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .asString();

        if (response.getStatus() == HttpStatus.NO_CONTENT.value()) {
            response.getHeaders().remove("Login");
            return ResponseEntity.ok("Session Logout Successfully!");
        } else {
            throw new PreconditionFailedException("Session not found!");
        }
    }

    public ResponseEntity<String> resetPassword(Jwt jwt, String userId, ResetPasswordRequest resetPasswordRequest) throws UnirestException {
        var url = baseUrl + "/admin/realms/" + realm + "/users/" + userId + "/reset-password";
        Unirest.setTimeouts(0, 0);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody;
        try {
            requestBody = objectMapper.writeValueAsString(resetPasswordRequest);
        } catch (JsonProcessingException e) {
            throw new UnirestException("Error converting ResetPasswordRequest to JSON");
        }
        HttpResponse<String> response = Unirest.put(url)
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .header("Content-Type", "application/json")
                .body(requestBody)
                .asString();

        if (response.getStatus() == HttpStatus.NO_CONTENT.value()) {
            return ResponseEntity.ok("Reset Password Successfully!");
        } else {
            throw new PreconditionFailedException("Can not reset password!");
        }
    }

    public ResponseEntity<String> deleteUser(Jwt jwt, String userId) throws UnirestException {
        var url = baseUrl + "/admin/realms/" + realm + "/users/" + userId;
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = Unirest.delete(url)
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .asString();

        if (response.getStatus() == HttpStatus.NO_CONTENT.value()) {
            return ResponseEntity.ok(String.format("User %s successfully deleted", userId));
        } else {
            throw new PreconditionFailedException("Session not found!");
        }
    }

    public void updateUserInformation(Jwt jwt, UpdateUserDto updateUserDto) throws UnirestException, JsonProcessingException {
        Unirest.setTimeouts(0, 0);
        objectMapper = new ObjectMapper();
        var endpoint = baseUrl + "/admin/realms/" + realm + "/users/" + updateUserDto.getId();
        String json = objectMapper.writeValueAsString(updateUserDto);
        HttpResponse<String> response = Unirest.put(endpoint)
                .header("Authorization", "Bearer " + jwt.getTokenValue())
                .header("Content-Type", "application/json")
                .header("Cookie", "frontend_lang=en_US")
                .body(json)
                .asString();
        response.getStatus();
    }

    public ResponseEntity<String> logout(HttpServletRequest request) throws UnirestException {
        var tokenEndpoint = baseUrl + "/realms/" + realm + "/protocol/openid-connect/logout";
        HttpResponse<String> response = Unirest.post(tokenEndpoint)
                .header("Content-Type", CONTENT_TYPE)
                .field("client_id", clientId)
                .field("refresh_token", tokenResponse.getRefreshToken())
                .asString();
        tokenResponse.setToken(null);
        tokenResponse.setRefreshToken(null);
        tokenResponse.setExpirationDate(null);
        return new ResponseEntity<>("You have successfully logged out.", HttpStatus.OK);
    }

    public static String[] splitFullName(String fullName) {
        String[] names = fullName.split(" ");
        String firstName = "";
        String lastName = "";
        if (names.length >= 1) {
            firstName = names[0];
        }
        if (names.length >= 2) {
            lastName = names[names.length - 1];
        }
        return new String[]{firstName, lastName};
    }

    public static String getEmailFromToken(String accessToken) {
        try {
            SignedJWT jwt = SignedJWT.parse(accessToken);
            return jwt.getJWTClaimsSet().getStringClaim("email");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getToken(String jsonResponse) {
        try {
            // Parse the JSON response
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
            return jsonNode.get("access_token").asText();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Date getAccessTokenExpirationDate(String accessToken) {
        try {
            JWT jwt = JWTParser.parse(accessToken);
            if (jwt.getJWTClaimsSet().getExpirationTime() != null) {
                return jwt.getJWTClaimsSet().getExpirationTime();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static CreateUserDto mapToKeycloakUser(User user, String password) {
        Map<String, Boolean> access = new HashMap<>();
        Map<String, String> attributes = new HashMap<>();
        var names = splitFullName(user.getFullName());
        access.put("manageGroupMembership", true);
        access.put("view", true);
        access.put("mapRoles", true);
        access.put("impersonate", true);
        access.put("manage", true);
        List<CredentialRepresentation> credentials = new ArrayList<>();

        CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
        credentialRepresentation.setValue(password);
        credentialRepresentation.setTemporary(false);

        credentials.add(credentialRepresentation);
        return CreateUserDto.builder().username(user.getFullName()).enabled(true).emailVerified(true).email(user.getEmail()).firstName(names[0]).lastName(names[0]).credentials(credentials).attributes(attributes).realmRoles(null).access(access).build();
    }
}
