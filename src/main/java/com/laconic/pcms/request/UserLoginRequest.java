package com.laconic.pcms.request;

import com.laconic.pcms.validation.EmailRegex;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.laconic.pcms.constants.ValidationConstants.NAME_MESSAGE;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLoginRequest {
    @EmailRegex
    private String email;
    private String password;
    @NotNull(message = NAME_MESSAGE)
    @NotEmpty(message = NAME_MESSAGE)
    private String fullName;
}
