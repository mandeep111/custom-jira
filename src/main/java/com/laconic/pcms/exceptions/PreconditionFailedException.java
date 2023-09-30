package com.laconic.pcms.exceptions;

public class PreconditionFailedException extends RuntimeException {
    public PreconditionFailedException() {
        super();
    }

    public PreconditionFailedException(String message) {
        super(message);
    }
}
