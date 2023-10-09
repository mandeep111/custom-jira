package com.laconic.pcms.component.authentication;

import com.laconic.pcms.entity.User;
import com.laconic.pcms.repository.IUserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final IUserRepo userRepository;

    public CustomUserDetailsService(IUserRepo userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(username);

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("USER NOT FOUND ".concat(username));
        }
        return new MyUserDetails(user.get());
    }
}
