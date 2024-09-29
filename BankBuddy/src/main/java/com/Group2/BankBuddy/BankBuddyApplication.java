package com.Group2.BankBuddy;

import com.Group2.BankBuddy.dtos.PersonSignUpDto;
import com.Group2.BankBuddy.services.PersonService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync


public class BankBuddyApplication {

	public static void main(String[] args) {
		// Run the application
		ConfigurableApplicationContext context = SpringApplication.run(BankBuddyApplication.class, args);

		// Create an admin account
	//	createAdminAccount(context);

		// Close the context when done (optional)
		//context.close();
	}

	private static void createAdminAccount(ConfigurableApplicationContext context) {
		// Get the PersonService bean from the context
		PersonService personService = context.getBean(PersonService.class);

		// Create a PersonSignUpDto for the admin
		PersonSignUpDto adminDto = PersonSignUpDto.builder()
				.firstName("Admin")
				.lastName("Admin")
				.email("admin@bankbuddy.com")
				.password("admin")
				.phone("111-11-15555")
				.address("123 Main St")
				.ssn("123-45-6789")
				.state("CA")
				.city("San Jose")
				.zip("12345")
				.dob("2023-01-15")
				.accountType("Both")
				.role("ROLE_ADMIN") // Set the role to "ADMIN"
				.build();

		// Use the PersonService to create the admin account
		personService.register(adminDto);
	}
}
