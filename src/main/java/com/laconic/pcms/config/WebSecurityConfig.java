package com.laconic.pcms.config;

import com.laconic.pcms.component.authentication.CustomUserDetailsService;
import com.laconic.pcms.component.authentication.JwtAuthenticationFilter;
import com.laconic.pcms.constants.Routes;
import com.laconic.pcms.repository.IUserRepo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
/*    @Value("${server.allowed-origins}")
    String allowedOrigins;*/
    private final IUserRepo userRepository;

    private static final String[] PUBLIC_URLS = {
            "/actuator/**",
            "/v1/user/**",
            "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html"
    };

    private static final String[] PRIVATE_ROUTES = {
            Routes.company, Routes.customer,
            Routes.mail_template, Routes.milestone, Routes.project,
            Routes.task, Routes.tag, Routes.stage,
            Routes.project_update, Routes.task_stage
    };
    private static final String[] PRIVATE_URLS = Arrays.stream(PRIVATE_ROUTES)
            .map(url -> url.concat("/*"))
            .toArray(String[]::new);

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    public WebSecurityConfig(IUserRepo userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_URLS).permitAll()
                        .anyRequest().authenticated()).sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
                        .authenticationProvider(authenticationProvider()).addFilterBefore(
                                jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService(this.userRepository);
    }

}
