package com.Group2.BankBuddy.controller;

import com.Group2.BankBuddy.dtos.PersonDto;
import com.Group2.BankBuddy.exceptions.PersonNotFoundException;
import com.Group2.BankBuddy.services.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/people")
public class PersonController {

    private final PersonService personService;

    @GetMapping
    public ResponseEntity<List<PersonDto>> getAllPersons() {
        List<PersonDto> allPersons = personService.getAllPersons();
        return ResponseEntity.ok(allPersons);
    }

    @GetMapping("/{personId}")
    public ResponseEntity<PersonDto> getPersonById(@PathVariable Integer personId) {
        PersonDto person = personService.getPersonById(personId);
        if (person != null) {
            return ResponseEntity.ok(person);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{personId}")
    public ResponseEntity<PersonDto> updatePerson(
            @PathVariable Integer personId,
            @RequestBody PersonDto updatedPersonDto
    ) {
        PersonDto updatedPerson = personService.updatePerson(personId, updatedPersonDto);
        return ResponseEntity.ok(updatedPerson);
    }

    @DeleteMapping("/{personId}")
    public ResponseEntity<String> deletePerson(
            @PathVariable Integer personId,
            @RequestBody Map<String, String> requestBody) {
        try {
            // Extracting information from the request body
            String password = requestBody.get("password");

            // Check if the provided password is correct
            boolean isPasswordCorrect = personService.checkPasswordForPerson(personId, password);

            if (!isPasswordCorrect) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
            }

            // If password is correct, deactivate the person
            personService.disActivatePersonById(personId);

            return ResponseEntity.ok("Person with ID " + personId + " has been deleted");
        } catch (PersonNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }




}
