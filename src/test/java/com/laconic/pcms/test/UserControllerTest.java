package com.laconic.pcms.test;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.laconic.pcms.config.ContainerConfig;
import com.laconic.pcms.config.TokenSetup;
import com.laconic.pcms.request.UserLoginRequest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static com.laconic.pcms.config.TokenSetup.asJsonString;
import static io.restassured.RestAssured.given;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerTest extends ContainerConfig {
    @LocalServerPort
    private Integer port;
   static String token = "";



    @BeforeEach
    void setUp() throws JsonProcessingException {
        RestAssured.baseURI = "http://localhost:" + port;
        token = TokenSetup.loginAndGetToken();
    }

    @Test
    public void testSaveUser() {
        UserLoginRequest request = UserLoginRequest.builder()
                .email("shram1@gmail.com")
                .password("ram12345")
                .fullName("ram")
                .build();
        given()
                .port(port)
                .header("Authorization", "Bearer " + token)
                .contentType("application/json")
                .body(asJsonString(request))
                .when()
                .post("/v1/user")
                .then()
                .statusCode(200);
    }

    @Test
    public void testUserLogin() {
        UserLoginRequest request = UserLoginRequest.builder()
                .email("a@gmail.com")
                .password("12345")
                .build();

        given()
                .port(port)
                .contentType("application/json")
                .body(asJsonString(request))
                .when()
                .post("/v1/user/login")
                .then()
                .statusCode(200);
    }

    @Test
    public void testUserLoginValidation() {
        // Define the user to be sent in the request
        UserLoginRequest request = UserLoginRequest.builder()
                .email("aa")
                .password("12345")
                .build();
        given()
                .port(port)
                .contentType("application/json")
                .body(asJsonString(request))
                .when()
                .post("/v1/user/login")
                .then()
                .statusCode(400);
    }

    @Test
    public void testUserLoginWithBadCredential() {
        // Define the user to be sent in the request
        UserLoginRequest request = UserLoginRequest.builder()
                .email("a@gmail.com")
                .password("123456789") // wrong password
                .build();
        given()
                .port(port)
                .contentType("application/json")
                .body(asJsonString(request))
                .when()
                .post("/v1/user/login")
                .then()
                .statusCode(412);
    }

}
