package com.laconic.pcms.controller;

import com.laconic.pcms.component.WorkflowComponent;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/workflow")
public class WorkflowController {
    private final WorkflowComponent workflowComponent;

    public WorkflowController(WorkflowComponent workflowComponent) {
        this.workflowComponent = workflowComponent;
    }

/*
    @GetMapping("/auth")
    public String getToken() {
        return workflowComponent.getLoginToken();
    }
*/

    @GetMapping("/forms")
    public List<Map<String, String>> getFormList(@AuthenticationPrincipal Jwt jwt) {
        return workflowComponent.getFormDetails(jwt.getTokenValue());
    }

    @GetMapping("/status/{requestCode}")
    public boolean getStatus(@AuthenticationPrincipal Jwt jwt, @PathVariable String requestCode) {
        return workflowComponent.checkStatus(requestCode, jwt.getTokenValue());
    }

}
