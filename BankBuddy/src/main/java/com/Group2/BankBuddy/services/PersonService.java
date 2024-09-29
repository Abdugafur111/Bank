package com.Group2.BankBuddy.services;


import com.Group2.BankBuddy.Entity.Account;
import com.Group2.BankBuddy.Entity.Person;
import com.Group2.BankBuddy.dtos.PersonCredentialsDto;
import com.Group2.BankBuddy.dtos.PersonDto;
import com.Group2.BankBuddy.dtos.PersonSignUpDto;
import com.Group2.BankBuddy.exceptions.AppException;
import com.Group2.BankBuddy.exceptions.EmailAlreadyExistsException;
import com.Group2.BankBuddy.exceptions.PersonNotFoundException;
import com.Group2.BankBuddy.mappers.PersonMapper;
import com.Group2.BankBuddy.repositories.AccountRepository;
import com.Group2.BankBuddy.repositories.PersonRepository;
import com.Group2.BankBuddy.repositories.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;
    private final PersonMapper personMapper;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;


    public PersonDto login(PersonCredentialsDto credentialsDto) {
        Person person = personRepository.findByEmail(credentialsDto.getEmail())
                .orElseThrow(() -> new AppException("Unknown person", HttpStatus.NOT_FOUND));

        if (!person.isActive()){
            throw new AppException("Unknown person", HttpStatus.NOT_FOUND);
        }


        if (passwordEncoder.matches(credentialsDto.getPassword(), person.getPassword())) {
            PersonDto personDto = personMapper.toPersonDto(person);
            return personDto;
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }
    public PersonDto setNewPasswordByEmail(String email, String newPassword) {
        Optional<Person> optionalPerson = personRepository.findByEmail(email);

        if (optionalPerson.isPresent()) {

            Person person = optionalPerson.get();
            PersonDto personDto = personMapper.toPersonDto(person);

            String encodedPassword = passwordEncoder.encode(newPassword);
            person.setPassword(encodedPassword);
            personRepository.save(person);
            return personDto;
        } else {
            throw new PersonNotFoundException("Person with email " + email + " not found");
        }
    }
    public PersonDto register(PersonSignUpDto personDto) {
        Optional<Person> existingPerson = personRepository.findByEmail(personDto.getEmail());

        if (existingPerson.isPresent()) {
            throw new EmailAlreadyExistsException("Person with email " + personDto.getEmail() + " already exists");
        }
        // Create a new Person entity
        Person person = personMapper.signUpDtoToPerson(personDto);
        String encodedPassword = passwordEncoder.encode(personDto.getPassword());
        person.setPassword(encodedPassword);
        if(person.getRole() == null) {
            person.setRole("CUSTOMER");
        }
        person.setCreationDate(new Date());
        person.setActive(true);
        // Save the new Person entity
        Person savedPerson = personRepository.save(person);

        // Create a new Account entity
        if(personDto.getAccountType().equals("Both")){
            Account account = Account.builder()
                    .accountStatus("Active")
                    .balance(new BigDecimal("0.0")) // Set the initial balance as needed
                    .accountType("Saving")
                    .apy(4.0)
                    .person(savedPerson) // Associate the Account with the new Person
                    .build();
            accountRepository.save(account);


            Account account1 = Account.builder()
                    .accountStatus("Active")
                    .balance(new BigDecimal("0.0")) // Set the initial balance as needed
                    .accountType("Checking")
                    .apy(2.0)
                    .person(savedPerson) // Associate the Account with the new Person
                    .build();
            accountRepository.save(account1);

        }else {
            Account account = Account.builder()
                    .accountStatus("Active")
                    .balance(new BigDecimal("0.0")) // Set the initial balance as needed
                    .accountType(personDto.getAccountType())
                    .person(savedPerson) // Associate the Account with the new Person
                    .build();

            if (personDto.getAccountType().equals("Checking")){
                account.setApy(2.0);
            }else{
                account.setApy(4.0);
            }
            // Save the new Account entity
            accountRepository.save(account);
        }
        return personMapper.toPersonDto(savedPerson);
    }


    public boolean checkPasswordForPerson(Integer personId, String providedPassword) {
        // Retrieve the Person entity from the database
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new PersonNotFoundException("Person with ID " + personId + " not found"));

        // Retrieve the hashed password stored in the database
        String hashedPassword = person.getPassword();

        // Compare the provided password with the hashed password
        return passwordEncoder.matches(providedPassword, hashedPassword);
    }

    public List<PersonDto> getAllPersons() {
        List<Person> allPersons = personRepository.findAll();
        return personMapper.toPersonDtoList(allPersons);
    }

    public PersonDto getPersonById(Integer personId) {
        Optional<Person> personOptional = personRepository.findById(personId);
        return personOptional.map(personMapper::toPersonDto).orElse(null);
    }

    public PersonDto findByEmail(String email) {
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown person", HttpStatus.NOT_FOUND));
        return personMapper.toPersonDto(person);
    }


    public PersonDto updatePerson(Integer personId, PersonDto updatedPersonDto) {
        Optional<Person> personOptional = personRepository.findById(personId);

        if (personOptional.isPresent()) {
            Person existingPerson = personOptional.get();

            if (updatedPersonDto.getFirstName() != null) {
                existingPerson.setFirstName(updatedPersonDto.getFirstName());
            }
            if (updatedPersonDto.getLastName() != null) {
                existingPerson.setLastName(updatedPersonDto.getLastName());
            }

            if (updatedPersonDto.getPhone() != null) {
                existingPerson.setPhone(updatedPersonDto.getPhone());
            }
            if (updatedPersonDto.getAddress() != null) {
                existingPerson.setAddress(updatedPersonDto.getAddress());
            }
            if (updatedPersonDto.getSsn() != null) {
                existingPerson.setSsn(updatedPersonDto.getSsn());
            }
            if (updatedPersonDto.getDob() != null) {
                existingPerson.setDob(updatedPersonDto.getDob());
            }

            Person updatedPerson = personRepository.save(existingPerson);
            return personMapper.toPersonDto(updatedPerson);
        } else {
            throw new PersonNotFoundException("Person with ID " + personId + " not found");
        }
    }


    public void deletePersonById(Integer personId) throws PersonNotFoundException {
        Optional<Person> personOptional = personRepository.findById(personId);
        if (personOptional.isPresent()) {
            Person person = personOptional.get();

            personRepository.deleteById(personId);
        } else {
            throw new PersonNotFoundException("Person with ID " + personId + " not found");
        }
    }

    public void disActivatePersonById(Integer personId) throws PersonNotFoundException {
        Optional<Person> personOptional = personRepository.findById(personId);
        if (personOptional.isPresent()) {
            Person person = personOptional.get();
            person.setActive(false);
            personRepository.save(person);
        } else {
            throw new PersonNotFoundException("Person with ID " + personId + " not found");
        }
    }




}