package com.laconic.pcms.exceptions;

public class UnAuthorizedException extends RuntimeException {
    public UnAuthorizedException() {
        super();
    }

    public UnAuthorizedException(String message) {
        super(message);
    }
}

