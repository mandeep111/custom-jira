package com.laconic.pcms.utils;

import com.laconic.pcms.entity.User;
import com.laconic.pcms.repository.IUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import static com.laconic.pcms.component.KeyCloakComponent.getEmailFromToken;
import static com.laconic.pcms.component.KeyCloakComponent.getToken;
import static com.laconic.pcms.constants.AppMessages.USER;
import static com.laconic.pcms.utils.ExceptionMapper.throwNotFoundException;

@Component
@RequiredArgsConstructor
public class KeyCloakAuthenticationUtil {
    private final IUserRepo userRepo;
    public User getUser(String jsonResponse) {
        var email = getEmailFromToken(getToken(jsonResponse));
        return userRepo.findByEmail(email).orElseThrow(throwNotFoundException(email, USER, "EMAIL"));
    }

/*    public MyUserDetails getCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            var user = getUser();
            return new MyUserDetails(user);
        }
        return null;
    }*/

    public User getUser() {
        var email = getUserEmail();
        return userRepo.findByEmail(email).orElseThrow(throwNotFoundException(email, USER, "EMAIL"));
    }

    public static String getUserEmail() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            JwtAuthenticationToken principal = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
            return getEmailFromToken(principal.getToken().getTokenValue());
        }
        return null;
    }

    public User getKeyCloakUser(String jsonResponse) {
        var email = getEmailFromToken(getToken(jsonResponse));
        return userRepo.findByEmail(email).orElse(new User());
    }

}
