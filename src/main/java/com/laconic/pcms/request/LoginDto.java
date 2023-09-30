package com.laconic.pcms.request;

import com.laconic.pcms.validation.EmailRegex;
import jakarta.validation.constraints.NotBlank;

import static com.laconic.pcms.constants.ValidationConstants.PASSWORD_MESSAGE;
import static com.laconic.pcms.constants.ValidationConstants.USERNAME_MESSAGE;

public record LoginDto(@EmailRegex @NotBlank(message = USERNAME_MESSAGE) String email, @NotBlank(message = PASSWORD_MESSAGE) String password) {}
