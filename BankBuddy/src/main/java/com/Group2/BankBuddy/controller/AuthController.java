package com.Group2.BankBuddy.controller;


import com.Group2.BankBuddy.config.UserAuthenticationProvider;
import com.Group2.BankBuddy.dtos.PersonCredentialsDto;
import com.Group2.BankBuddy.dtos.PersonDto;
import com.Group2.BankBuddy.dtos.PersonSignUpDto;
import com.Group2.BankBuddy.exceptions.EmailAlreadyExistsException;
import com.Group2.BankBuddy.exceptions.PersonNotFoundException;
import com.Group2.BankBuddy.services.PersonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class AuthController {

    private final PersonService personService;


    private final UserAuthenticationProvider userAuthenticationProvider;

    @PostMapping("/registration")
    public ResponseEntity<PersonDto> registration(@RequestBody @Valid PersonSignUpDto personDto) {
        try {
            PersonDto createdPerson = personService.register(personDto);
            createdPerson.setToken(userAuthenticationProvider.createToken(personDto.getEmail()));

            URI location = URI.create("/persons/" + createdPerson.getPersonID());
            return ResponseEntity.created(location).body(createdPerson);
        } catch (EmailAlreadyExistsException e) {
            PersonDto errorResponse = new PersonDto();
            errorResponse.setErrorMessage("Person with this email already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<PersonDto> logins(@RequestBody @Valid PersonCredentialsDto credentialsDto) {
        PersonDto personDto = personService.login(credentialsDto);
        personDto.setToken(userAuthenticationProvider.createToken(personDto.getEmail()));
        return ResponseEntity.ok(personDto);
    }

    @PostMapping("/setPassword")
    public ResponseEntity<String> setNewPasswordByEmail(
            @RequestBody Map<String, String> requestBody) {
        try {
            String email = requestBody.get("email");
            String newPassword = requestBody.get("newPassword");


            // Your existing logic for setting the new password
            PersonDto personDto = personService.setNewPasswordByEmail(email, newPassword);

            // Generate a token and update the PersonDto
            personDto.setToken(userAuthenticationProvider.createToken(personDto.getEmail()));

            return ResponseEntity.ok("Password successfully changed");
        } catch (PersonNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Person with the specified email not found");
        }
    }



    @GetMapping("/dashboard")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Welcome to ADMIN Dashboard");
    }
}
