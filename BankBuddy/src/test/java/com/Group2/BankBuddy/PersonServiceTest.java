package com.Group2.BankBuddy;

import com.Group2.BankBuddy.Entity.Person;
import com.Group2.BankBuddy.Entity.Transaction;
import com.Group2.BankBuddy.dtos.PersonCredentialsDto;
import com.Group2.BankBuddy.dtos.PersonDto;
import com.Group2.BankBuddy.dtos.PersonSignUpDto;
import com.Group2.BankBuddy.exceptions.PersonNotFoundException;
import com.Group2.BankBuddy.mappers.PersonMapper;
import com.Group2.BankBuddy.repositories.AutoPaymentRepository;
import com.Group2.BankBuddy.repositories.PersonRepository;
import com.Group2.BankBuddy.repositories.TransactionRepository;
import com.Group2.BankBuddy.services.PersonService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static junit.framework.TestCase.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class PersonServiceTest {

    @Autowired
    private PersonService personService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private PersonMapper personMapper;

    @Autowired
    private AutoPaymentRepository auto;
    @Autowired
    private TransactionRepository trans;

    @Test
    @DisplayName("Test user registration")
    public void testRegistration() {
        // Create a PersonSignUpDto for testing
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();

        // Test registration
        PersonDto result;
        if(!personRepository.findByEmail("test@bankbuddy.com").isPresent()) {
            result = personService.register(personSignUpDto);
        }else{
            Optional<Person> pers = personRepository.findByEmail("test@bankbuddy.com");
            Person person = pers.orElse(null);
            result = personMapper.toPersonDto(person);
        }
        // Create a PersonDto with the expected values
        PersonDto expectedPersonDto = createExpectedPersonDto(personSignUpDto);
        Optional<Person> savedPerson = personRepository.findById(result.getPersonID());
        // Perform assertions
        assertNotNull(savedPerson);
        assertEquals(expectedPersonDto.getFirstName(), result.getFirstName());
        assertEquals(expectedPersonDto.getLastName(), result.getLastName());
        assertEquals(expectedPersonDto.getEmail(), result.getEmail());
        assertEquals(expectedPersonDto.getPhone(), result.getPhone());
        assertEquals(expectedPersonDto.getAddress(), result.getAddress());
        assertEquals(expectedPersonDto.getSsn(), result.getSsn());
        assertEquals(expectedPersonDto.getRole(), result.getRole());
        assertEquals(expectedPersonDto.getDob(), result.getDob());
        personService.deletePersonById(result.getPersonID());
    }

    @Test
    @DisplayName("Test user login")
    public void testLogin() {
        // Create a PersonSignUpDto for testing
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        // Test registration
        PersonDto expectedPersonDto = null;
        if(!personRepository.findByEmail("test@bankbuddy.com").isPresent()) {
            expectedPersonDto = personService.register(personSignUpDto);
        }else {
            expectedPersonDto = createExpectedPersonDto(personSignUpDto);
        }


        // Create a PersonCredentialsDto for testing login
        PersonCredentialsDto credentialsDto = PersonCredentialsDto.builder()
                .email("test@bankbuddy.com")
                .password("test")
                .build();

        // Test login
        PersonDto result = personService.login(credentialsDto);
        // Ensure the result is not null
        Assertions.assertNotNull(result);
        assertEquals(expectedPersonDto.getFirstName(), result.getFirstName());
        assertEquals(expectedPersonDto.getLastName(), result.getLastName());
        assertEquals(expectedPersonDto.getEmail(), result.getEmail());
        assertEquals(expectedPersonDto.getPhone(), result.getPhone());
        assertEquals(expectedPersonDto.getAddress(), result.getAddress());
        assertEquals(expectedPersonDto.getSsn(), result.getSsn());
        assertEquals(expectedPersonDto.getRole(), result.getRole());
        assertEquals(expectedPersonDto.getDob(), result.getDob());
        personService.deletePersonById(expectedPersonDto.getPersonID());

    }

    @Test
    @DisplayName("Test getting all persons")
    public void testGetAllPersons() {
        // Create a PersonSignUpDto for testing
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();

        // Test registration
        PersonDto result = null;
        if(!personRepository.findByEmail("test@bankbuddy.com").isPresent()){
             result = personService.register(personSignUpDto);
        }

        // Test getAllPersons
        List<PersonDto> allPersons = personService.getAllPersons();

        // Create a PersonDto with the expected values
        PersonDto expectedPersonDto = createExpectedPersonDto(personSignUpDto);

        // Perform assertions
        assertNotNull(allPersons);
        assertEquals(1, allPersons.size()); // Assuming there is only one person in the list

        // Check if the first person in the list matches the expected values
         result = allPersons.get(0);

        assertEquals(expectedPersonDto.getFirstName(), result.getFirstName());
        assertEquals(expectedPersonDto.getLastName(), result.getLastName());
        assertEquals(expectedPersonDto.getEmail(), result.getEmail());
        assertEquals(expectedPersonDto.getPhone(), result.getPhone());
        assertEquals(expectedPersonDto.getAddress(), result.getAddress());
        assertEquals(expectedPersonDto.getSsn(), result.getSsn());
        assertEquals(expectedPersonDto.getRole(), result.getRole());
        assertEquals(expectedPersonDto.getDob(), result.getDob());
        personService.deletePersonById(result.getPersonID());
    }


    @Test
    @DisplayName("Test finding person by email")
    public void testFindByEmail() {
        // Create a PersonSignUpDto for testing
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        System.out.println(personSignUpDto.getEmail());
        personService.register(personSignUpDto);

        // Find the PersonDto by email
        PersonDto result = personService.findByEmail(personSignUpDto.getEmail());

        // Create a PersonDto with the expected values
        PersonDto expectedPersonDto = createExpectedPersonDto(personSignUpDto);

        // Perform assertions
        Assertions.assertNotNull(result);
        assertEquals(expectedPersonDto.getFirstName(), result.getFirstName());
        assertEquals(expectedPersonDto.getLastName(), result.getLastName());
        assertEquals(expectedPersonDto.getEmail(), result.getEmail());
        assertEquals(expectedPersonDto.getPhone(), result.getPhone());
        assertEquals(expectedPersonDto.getAddress(), result.getAddress());
        assertEquals(expectedPersonDto.getSsn(), result.getSsn());
        assertEquals(expectedPersonDto.getRole(), result.getRole());
        assertEquals(expectedPersonDto.getDob(), result.getDob());
        personService.deletePersonById(result.getPersonID());
    }
//
    @Test
    @DisplayName("Test updating person information")
    public void testUpdatePerson() {
        // Create a PersonSignUpDto for testing
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();

        // Test registration
        PersonDto registeredPerson = null;
        if(!personRepository.findByEmail("test@bankbuddy.com").isPresent()) {
            registeredPerson = personService.register(personSignUpDto);
        }
        else {
            registeredPerson = createExpectedPersonDto(personSignUpDto);
        }
        // Update the PersonDto
        PersonDto updatedPersonDto = new PersonDto();
        updatedPersonDto.setFirstName("UpdatedFirstName");
        updatedPersonDto.setLastName("UpdatedLastName");
        updatedPersonDto.setPhone("UpdatedPhone");
        updatedPersonDto.setAddress("UpdatedAddress");
        updatedPersonDto.setSsn("UpdatedSSN");
        updatedPersonDto.setDob("2023-01-20");

        // Test updatePerson
        PersonDto updatedPerson = personService.updatePerson(registeredPerson.getPersonID(), updatedPersonDto);

        // Perform assertions
        assertEquals("UpdatedFirstName", updatedPerson.getFirstName());
        assertEquals("UpdatedLastName", updatedPerson.getLastName());
        assertEquals("UpdatedPhone", updatedPerson.getPhone());
        assertEquals("UpdatedAddress", updatedPerson.getAddress());
        assertEquals("UpdatedSSN", updatedPerson.getSsn());
        assertEquals("2023-01-20", updatedPerson.getDob());

        // Test updatePerson with non-existing ID
        assertThrows(PersonNotFoundException.class, () -> personService.updatePerson(-1, updatedPersonDto));
        personService.deletePersonById(registeredPerson.getPersonID());
    }
//
//
    @Test
    @DisplayName("Test setting a new password")
    public void testSetNewPassword() {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Create a PersonSignUpDto for testing
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();

        // Test registration
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Set a new password
        String newPassword = "newPassword";
        personService.setNewPasswordByEmail(registeredPerson.getEmail(), newPassword);

        // Retrieve the person after setting the new password
        Optional<Person> updatedPersonOptional = personRepository.findById(registeredPerson.getPersonID());

        // Perform assertions
        assertTrue(updatedPersonOptional.isPresent());
        Person updatedPerson = updatedPersonOptional.get();
        assertTrue(passwordEncoder.matches(newPassword, updatedPerson.getPassword()));

        // Test setNewPassword with non-existing ID
        assertThrows(PersonNotFoundException.class, () -> personService.setNewPasswordByEmail("gmail@gmail", "newPassword"));
        personService.deletePersonById(registeredPerson.getPersonID());
    }
//
    @Test
    @DisplayName("Test deleting a person by ID")
    public void testDisactivatePersonById() {

      //  auto.deleteAll();
//        trans.deleteAll();
//       personService.deletePersonById(283);
//        personService.deletePersonById(284);

        // Create a PersonSignUpDto for testing
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();

        // Test registration
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Delete the person by ID
        personService.deletePersonById(registeredPerson.getPersonID());

        // Verify that the person is deleted
        Optional<Person> deletedPersonOptional = personRepository.findById(registeredPerson.getPersonID());
        Assertions.assertFalse(deletedPersonOptional.isPresent(), "Person should be deleted");

        // Test deleting a non-existing person
        assertThrows(PersonNotFoundException.class, () -> personService.deletePersonById(-1));
    }

    private PersonSignUpDto createTestPersonSignUpDto() {
        return PersonSignUpDto.builder()
                .firstName("test")
                .lastName("test")
                .email("test@bankbuddy.com")
                .password("test")
                .phone("111-11-15555")
                .address("123 Main St")
                .ssn("123-45-6789")
                .state("CA")
                .city("San Jose")
                .zip("12345")
                .dob("2023-01-15")
                .accountType("Both")
                .role("ROLE_ADMIN")
                .build();
    }

    private PersonDto createExpectedPersonDto(PersonSignUpDto personSignUpDto) {
        PersonDto expectedPersonDto = new PersonDto();
        expectedPersonDto.setFirstName(personSignUpDto.getFirstName());
        expectedPersonDto.setLastName(personSignUpDto.getLastName());
        expectedPersonDto.setEmail(personSignUpDto.getEmail());
        expectedPersonDto.setPhone(personSignUpDto.getPhone());
        expectedPersonDto.setAddress(personSignUpDto.getAddress());
        expectedPersonDto.setSsn(personSignUpDto.getSsn());
        expectedPersonDto.setRole(personSignUpDto.getRole());
        expectedPersonDto.setDob(personSignUpDto.getDob());
        return expectedPersonDto;
    }




}
