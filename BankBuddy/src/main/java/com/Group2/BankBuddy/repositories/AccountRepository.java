package com.Group2.BankBuddy.repositories;

import com.Group2.BankBuddy.Entity.Account;
import com.Group2.BankBuddy.Entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    List<Account> findByPerson_PersonID(Integer personId);


    Integer findUserIdByAccountID(Integer accountID);
}



