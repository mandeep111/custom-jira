package com.laconic.pcms.component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WorkflowComponent {

    @Value("${WORKFLOW_URL}")
    private String BASE_URL;
    @Autowired
    private RestTemplate restTemplate;

    ObjectMapper objectMapper = new ObjectMapper();

    public String getLoginToken() {
        String loginUrl = BASE_URL + "auth/login";
        HttpHeaders headers = getHttpHeaders();
        HttpEntity<String> request = new HttpEntity<>("{ \"username\": \"admin\", \"password\": \"admin\" }", headers);
        return restTemplate.postForObject(loginUrl, request, String.class); // Return the token
    }

    public boolean checkStatus(String requestCode) {
        var trackerUrl = BASE_URL + "operatorRequest/track?requestCode=" + requestCode;
        var response = getLoginToken();
        var token = extractTokenFromJson(response);
        HttpHeaders headers = getHttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(trackerUrl, HttpMethod.GET, requestEntity, String.class);
        return hasCompletedStatus(responseEntity.getBody());
    }

    public List<Map<String, String>> getFormDetails() {
        String formListUrl = BASE_URL + "form";
        var response = getLoginToken();
        var token = extractTokenFromJson(response);
        HttpHeaders headers = getHttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(formListUrl, HttpMethod.GET, requestEntity, String.class);
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            String jsonResponse = responseEntity.getBody();
            try {
                JsonNode jsonNode = objectMapper.readTree(jsonResponse).get("content");
                List<Map<String, String>> formDetailsList = new ArrayList<>();

                for (JsonNode formNode : jsonNode) {
                    Map<String, String> formDetails = new HashMap<>();
                    formDetails.put("id", formNode.get("id").asText());
                    formDetails.put("formName", formNode.get("formName").asText());
                    formDetails.put("formTemplateId", formNode.get("formTemplateId").asText());
                    formDetailsList.add(formDetails);
                }

                return formDetailsList;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return null; // Handle errors appropriately
    }

    @NotNull
    private static HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public String extractTokenFromJson(String jsonString) {
        try {
            JsonNode jsonNode = objectMapper.readTree(jsonString);
            if (jsonNode.has("token")) {
                return jsonNode.get("token").asText();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean hasCompletedStatus(String jsonString) {
        try {
            JsonNode jsonNode = objectMapper.readTree(jsonString);

            if (jsonNode.isArray()) {
                for (JsonNode objectNode : jsonNode) {
                    String completed = "COMPLETED";
                    if (objectNode.has("status") && completed.equals(objectNode.get("status").asText())) {
                        return true;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
