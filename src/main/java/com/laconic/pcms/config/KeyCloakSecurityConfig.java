package com.laconic.pcms.config;

import com.laconic.pcms.component.KeyCloakComponent;
import com.laconic.pcms.response.TokenResponse;
import com.laconic.pcms.security.KeyCloakAuthorizationHeaderFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextHolderFilter;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
public class KeyCloakSecurityConfig {

    private final TokenResponse tokenResponse;
    private final KeyCloakComponent keyCloakComponent;

    private static final String[] PUBLIC_URLS = {
            "/actuator/**",
            "/v1/auth/**",
            "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html"
    };

    public KeyCloakSecurityConfig(TokenResponse tokenResponse, KeyCloakComponent keyCloakComponent) {
        this.tokenResponse = tokenResponse;
        this.keyCloakComponent = keyCloakComponent;
    }

    @Bean
    public SecurityFilterChain keyCloakFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_URLS).permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(grantedAuthoritiesExtractor())));
        http.csrf(AbstractHttpConfigurer::disable).cors(Customizer.withDefaults());
        http.addFilterAfter(new KeyCloakAuthorizationHeaderFilter(tokenResponse, keyCloakComponent), SecurityContextHolderFilter.class);
        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManagerKeyCloak(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .build();
    }

    private Converter<Jwt, AbstractAuthenticationToken> grantedAuthoritiesExtractor() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new GrantedAuthoritiesExtractor());
        return jwtAuthenticationConverter;
    }

    static class GrantedAuthoritiesExtractor implements Converter<Jwt, Collection<GrantedAuthority>> {
        public Collection<GrantedAuthority> convert(Jwt jwt) {
            return ((Map<String, Collection<?>>) jwt.getClaims().getOrDefault("realm_access", Collections.emptyMap())
            ).getOrDefault("roles", Collections.emptyList())
                    .stream()
                    .map(Object::toString)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        }
    }

}
