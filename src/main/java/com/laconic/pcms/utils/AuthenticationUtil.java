package com.laconic.pcms.utils;

import com.laconic.pcms.component.authentication.MyUserDetails;
import com.laconic.pcms.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthenticationUtil {
    public static String getCurrentUserName() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return userDetails.getUsername();
        }
        return "";
    }

    public static User getCurrentUser() {
        var userDetail = getCurrentUserDetail();
        assert userDetail != null;
        return userDetail.user();

    }

    public static MyUserDetails getCurrentUserDetail() {
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return (MyUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }
        return null;
    }
}
