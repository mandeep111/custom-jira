package com.laconic.pcms.response;

import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.Date;

@Data
@Service
public class TokenResponse {
    private String token;
    private String refreshToken;
    private Date expirationDate;
}
