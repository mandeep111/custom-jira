package com.laconic.pcms;

import com.laconic.pcms.config.ContainerConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootTest
@EnableJpaRepositories
class PcmsApplicationTests {

	@Test
	void contextLoads() {
	}

	public static void main(String[] args) {
		SpringApplication.from(PcmsApplication::main)
				.with(ContainerConfig.class)
				.run(args);

	}
}
