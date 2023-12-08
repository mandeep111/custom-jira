package com.laconic.pcms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.keycloak.representations.idm.CredentialRepresentation;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDto {

    @JsonProperty("username")
    private String username;

    @JsonProperty("enabled")
    private boolean enabled;

    @JsonProperty("emailVerified")
    private boolean emailVerified;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("email")
    private String email;

    @JsonProperty("access")
    private Map<String, Boolean> access;

    @JsonProperty("realmRoles")
    private List<String> realmRoles;

    @JsonProperty("requiredActions")
    private List<String> requiredActions;

    @JsonProperty("attributes")
    private Map<String, String> attributes;

    @JsonProperty("credentials")
    private List<CredentialRepresentation> credentials;



}

