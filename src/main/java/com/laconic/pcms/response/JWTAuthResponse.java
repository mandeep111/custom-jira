package com.laconic.pcms.response;

import lombok.*;

import java.util.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JWTAuthResponse {
    private Long id;
    private String email;
    private String fullname;
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Date lastLogin;
    private Date expirationDate;

}
