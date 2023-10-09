package com.laconic.pcms.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laconic.pcms.entity.User;

import static io.restassured.RestAssured.given;

public class TokenSetup {

    // get token from real database
    public static String loginAndGetToken() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        var user = User.builder().email("abcd@gmail.com").password("12345").build();
        return given()
                .port(8080)
                .contentType("application/json")
                .body(objectMapper.writeValueAsString(user))
                .when()
                .post("/v1/user/login")
                .then()
                .statusCode(200)
                .extract()
                .jsonPath()
                .getString("token");
    }

    public static String asJsonString(final Object o) {
        try {
            final ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Can not convert into JSON: " + e.getMessage());
        }
    }
}
