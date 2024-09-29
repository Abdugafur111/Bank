package com.Group2.BankBuddy.repositories;

import com.Group2.BankBuddy.Entity.Account;
import com.Group2.BankBuddy.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.person.personID = :personID ORDER BY t.transactionDate DESC")
    List<Transaction> findTransactionsByPersonID(@Param("personID") Integer personID);

    void deleteByDestinationAccount(Account account);
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccount.accountID = :accountId OR t.destinationAccount.accountID = :accountId ORDER BY t.transactionDate DESC")
    List<Transaction> findTransactionsByAccountId(@Param("accountId") Integer accountId);

}

