package com.laconic.pcms.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @JsonIgnore
    private String type = "password";
    private String value;
    @JsonIgnore
    private Boolean temporary = false;
}
