package com.laconic.pcms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDto {
    private String id;
    private String username;
    private boolean emailVerified;
    private String firstName;
    private String lastName;
    private String email;
}
