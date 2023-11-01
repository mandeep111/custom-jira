package com.laconic.pcms.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Optional;

import static com.laconic.pcms.component.KeyCloakComponent.getEmailFromToken;


public class EntityAuditorAware implements AuditorAware<String> {
    @NotNull
    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            if (authentication instanceof JwtAuthenticationToken principal) {
                return Optional.ofNullable(getEmailFromToken(principal.getToken().getTokenValue()));
            } else {
                return Optional.of("admin@laconic.com");
            }
        } else {
            return Optional.of("admin@laconic.com");
        }
    }
}
