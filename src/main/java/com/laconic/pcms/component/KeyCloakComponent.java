package com.laconic.pcms.component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laconic.pcms.component.authentication.CustomUserDetailsService;
import com.laconic.pcms.dto.CreateUserDto;
import com.laconic.pcms.dto.UpdatePassword;
import com.laconic.pcms.dto.UpdateUserDto;
import com.laconic.pcms.entity.User;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.repository.IUserRepo;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.response.JWTAuthResponse;
import com.laconic.pcms.utils.KeyCloakAuthenticationUtil;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.nimbusds.jose.proc.SimpleSecurityContext;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
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

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String jwksUri;

    private ObjectMapper objectMapper;
    private final KeyCloakAuthenticationUtil keyCloakAuthenticationUtil;
    private final IUserRepo userRepo;

    public void signup(CreateUserDto dto, Jwt jwt) throws JsonProcessingException, UnirestException {
        objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(dto);
        System.out.println(json);
        Unirest.setTimeouts(0, 0);
        var signUpUrl = baseUrl + "/admin/realms/test-realm/users";
        HttpResponse<String> response = Unirest.post(signUpUrl)
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " +  jwt.getTokenValue())
                .body(json)
                .asString();
        if (response.getStatus() != HttpStatus.CREATED.value()) {
            throw new PreconditionFailedException("Something went wrong.. " + response.getStatusText());
        }
        System.out.println(response);
    }

    public ResponseEntity<JWTAuthResponse> getAccessToken(LoginDto loginRequest) throws UnirestException {
        var tokenEndpoint = baseUrl +"/realms/"+realm+"/protocol/openid-connect/token";
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = Unirest.post(tokenEndpoint)
                .header("Content-Type", CONTENT_TYPE)
                .field("client_id", clientId)
                .field("username", loginRequest.email())
                .field("password", loginRequest.password())
                .field("grant_type", "password")
                .asString();
        if (response.getStatus() == HttpStatus.OK.value()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                AccessTokenResponse accessTokenResponse = objectMapper.readValue(response.getBody(), AccessTokenResponse.class);
                // if user is present in keycloak but not in the application, we will create it
                var user = keyCloakAuthenticationUtil.getKeyCloakUser(response.getBody());
                if (user.getId() == null) {
                    user = saveUserInDb(User.builder()
                            .email(loginRequest.email())
                            .password(loginRequest.password())
                            .fullName(loginRequest.email())
                            .build());
                }
                var expiryDate = getAccessTokenExpirationDate(accessTokenResponse.getToken());
                return ResponseEntity.ok(new JWTAuthResponse(user.getId(), user.getEmail(),  user.getFullName(), accessTokenResponse.getToken(), accessTokenResponse.getRefreshToken(), "bearer", new Date(), expiryDate));
            } catch (IOException e) {
                System.out.println(e.getMessage());
                throw new PreconditionFailedException(e.getMessage());
            }
        } else {
            throw new PreconditionFailedException("user not found");
        }
    }
    public void deleteUser() {
        // may be in future
    }

    public boolean updatePassword(UpdatePassword updatePassword, String id) throws UnirestException, JsonProcessingException {
        Unirest.setTimeouts(0, 0);
        String json = objectMapper.writeValueAsString(updatePassword);
        var endpoint = baseUrl+ "/admin/realms/"+ realm + "/users/" + id + "/reset-password";
        HttpResponse<String> response = Unirest.put(endpoint)
                .header("Content-Type", "application/json")
                .header("Cookie", "frontend_lang=en_US")
                .body(json)
                .asString();
        return response.getStatus() == HttpStatus.OK.value();
    }

    public boolean updateUserInformation(UpdateUserDto updateUserDto) throws UnirestException, JsonProcessingException {
        Unirest.setTimeouts(0, 0);
        objectMapper = new ObjectMapper();
        var endpoint = baseUrl+ "/admin/realms/"+ realm + "/users/" + updateUserDto.getId();
        String json = objectMapper.writeValueAsString(updateUserDto);
        HttpResponse<String> response = Unirest.put(endpoint)
                .header("Content-Type", "application/json")
                .header("Cookie", "frontend_lang=en_US")
                .body(json)
                .asString();
        return response.getStatus() == HttpStatus.OK.value();
    }

    public boolean logout(Jwt jwt) throws UnirestException {
        Unirest.setTimeouts(0, 0);
        var logoutUrl = baseUrl+"/admin/realms/test-realm/users/"+jwt.getSubject()+"/logout";
        HttpResponse<String> response = Unirest.post(logoutUrl)
                .header("Cookie", "frontend_lang=en_US")
                .asString();
        return response.getStatus() == HttpStatus.OK.value();
    }

    public static String extractPassword(List<Map<String, ?>> credentials) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        var json = objectMapper.writeValueAsString(credentials);
        JsonNode rootNode = objectMapper.readTree(json);
        if (rootNode.isArray()) {
            for (JsonNode node : rootNode) {
                JsonNode valueNode = node.get("value");
                if (valueNode != null && valueNode.isTextual()) {
                    return valueNode.asText();
                }
            }
        }
        return null;
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

    public static JWT parseJwt(String token) {
        try {
            // Parse the JWT token
            return JWTParser.parse(token);
        } catch (Exception e) {
            // Handle parsing errors
            e.printStackTrace();
            return null;
        }
    }

    public User saveUserInDb(User user) {
        return this.userRepo.saveAndFlush(user);
    }

    public static CreateUserDto mapToKeycloakUser(User user, String password, String defaultPage) {
        Map<String, Boolean> access = new HashMap<>();
        Map<String, String> attributes = new HashMap<>();
        var names = splitFullName(user.getFullName());
        access.put("manageGroupMembership", true);
        access.put("view", true);
        access.put("mapRoles", true);
        access.put("impersonate", true);
        access.put("manage", true);
        List<CredentialRepresentation> credentials = new ArrayList<>();
        attributes.put("default_page", defaultPage);

        CredentialRepresentation credentialRepresentation = new
                CredentialRepresentation();
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
        credentialRepresentation.setValue(password);
        credentialRepresentation.setTemporary(false);

        credentials.add(credentialRepresentation);
        return CreateUserDto.builder()
                .username(user.getFullName())
                .enabled(true)
                .emailVerified(true)
                .email(user.getEmail())
                .firstName(names[0])
                .lastName(names[0])
                .credentials(credentials)
                .attributes(attributes)
                .realmRoles(null)
                .access(access)
                .build();
    }
}
