package com.laconic.pcms.config;

import org.springframework.boot.devtools.restart.RestartScope;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.OracleContainer;

@TestConfiguration(proxyBeanMethods = false)
@ActiveProfiles("test")
public class ContainerConfig {

    // create test database container for testing, later we can load real data to test
    static OracleContainer oracleContainer;
    @Bean
    @RestartScope
    public static OracleContainer getOracleContainer(){
        oracleContainer = new OracleContainer("gvenzl/oracle-xe:21-slim");
        oracleContainer.start();
        Runtime.getRuntime().addShutdownHook(new Thread(oracleContainer::stop));
        return oracleContainer;
    }

    @ServiceConnection
    final static OracleContainer getContainer = getOracleContainer();

}