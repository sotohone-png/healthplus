package com.healthapi.test;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class healthapiApplicationTests {

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void contextLoads() {
	}

	@Test
	void testEncode() {
		String pw = "1111";
		String encoded = passwordEncoder.encode(pw);
		System.out.println("encoded: " + encoded);
	}
}