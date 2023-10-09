package com.laconic.pcms.aspects;

import com.laconic.pcms.exceptions.NotFoundException;
import com.laconic.pcms.exceptions.PreconditionFailedException;
import com.laconic.pcms.exceptions.UnAuthorizedException;
import com.laconic.pcms.exceptions.ValidationException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Aspect
@Component
public class ServiceAspect {
    private final Logger logger = Logger.getLogger(ServiceAspect.class.getName());

    @Pointcut("execution(* com.laconic.pcms.service.impl..*(..))")
    public void monitorResourceMethods() {}

    @Before("monitorResourceMethods()")
    public void beforeMethodExecution(JoinPoint joinPoint) {
        // Code executed before the monitored method
        logger.info("Before executing: " + joinPoint.getSignature());
    }

    @AfterReturning(pointcut = "monitorResourceMethods()", returning = "result")
    public void afterMethodExecution(JoinPoint joinPoint, Object result) {
        // Code executed after the monitored method returns successfully
        logger.info("After executing: " + joinPoint.getSignature());
    }

    @AfterThrowing(pointcut = "monitorResourceMethods()", throwing = "exception")
    public void afterMethodException(JoinPoint joinPoint, NotFoundException exception) {
        logException(joinPoint, exception);
    }

    @AfterThrowing(pointcut = "monitorResourceMethods()", throwing = "exception")
    public void afterMethodException(JoinPoint joinPoint, PreconditionFailedException exception) {
        logException(joinPoint, exception);
    }

    @AfterThrowing(pointcut = "monitorResourceMethods()", throwing = "exception")
    public void afterMethodException(JoinPoint joinPoint, UnAuthorizedException exception) {
        logException(joinPoint, exception);
    }

    @AfterThrowing(pointcut = "monitorResourceMethods()", throwing = "exception")
    public void afterMethodException(JoinPoint joinPoint, ValidationException exception) {
        logException(joinPoint, exception);
    }

    private void logException(JoinPoint joinPoint, Exception exception) {
        logger.severe("Exception in: " + joinPoint.getSignature());
        logger.severe("Original Exception Message: " + exception);
    }

}

