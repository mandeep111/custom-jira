package com.laconic.pcms.response;

import lombok.Data;

import java.util.List;

@Data
public class KeycloakUserResponse {
    private String id;
    private Long createdTimestamp;
    private String username;
    private Boolean enabled;
    private Boolean totp;
    private Boolean emailVerified;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> disableableCredentialTypes;
    private List<String> requiredActions;
    private Long notBefore;
    private Access access;

    @Data
    public static class Access {
        private Boolean manageGroupMembership;
        private Boolean view;
        private Boolean mapRoles;
        private Boolean impersonate;
        private Boolean manage;
    }
}
