package com.Group2.BankBuddy.repositories;


import com.Group2.BankBuddy.Entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Integer> {

    Optional<Person> findByEmail(String email);

    Optional<Person> findByPhone(String phone);

    Optional<Person> findBySsn(String ssn);
}
