package com.laconic.pcms.security;

import com.laconic.pcms.component.KeyCloakComponent;
import com.laconic.pcms.request.LoginDto;
import com.laconic.pcms.response.TokenResponse;
import com.mashape.unirest.http.exceptions.UnirestException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

@RequiredArgsConstructor
public class KeyCloakAuthorizationHeaderFilter extends OncePerRequestFilter {

    private final TokenResponse tokenResponse;
    private final KeyCloakComponent keyCloakComponent;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = tokenResponse.getToken();
        Date expirationDate = tokenResponse.getExpirationDate();
        String requestPath = request.getRequestURI();

        if ("/v1/auth/login".equals(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (expirationDate != null && expirationDate.before(new Date())) {
            try {
                LoginDto loginDto = new LoginDto(null, null, "refresh_token");
                keyCloakComponent.getAccessToken(loginDto);
            } catch (UnirestException e) {
                throw new RuntimeException(e);
            }
        }

        HttpServletRequest modifiedRequest = token != null ? addTokenToHeader(request, token) : request;
        filterChain.doFilter(modifiedRequest, response);
    }

    private HttpServletRequest addTokenToHeader(HttpServletRequest request, String token) {
        return new HttpServletRequestWrapper(request) {
            @Override
            public String getHeader(String name) {
                if ("Authorization".equalsIgnoreCase(name)) {
                    return "Bearer " + token;
                }
                return super.getHeader(name);
            }
        };
    }
}
