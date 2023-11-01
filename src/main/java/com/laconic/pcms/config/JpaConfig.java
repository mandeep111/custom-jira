package com.laconic.pcms.config;


import com.laconic.pcms.repository.ITestRepoImpl;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.laconic.pcms.repository", repositoryBaseClass = ITestRepoImpl.class)
public class JpaConfig {}
