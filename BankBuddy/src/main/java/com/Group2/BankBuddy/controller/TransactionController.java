package com.Group2.BankBuddy.controller;

import com.Group2.BankBuddy.Entity.Transaction;
import com.Group2.BankBuddy.dtos.TransactionDTO;
import com.Group2.BankBuddy.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/user/{userId}")
    public List<TransactionDTO> getUserTransactions(@PathVariable Integer userId) {
        List<Transaction> transactions = transactionRepository.findTransactionsByPersonID(userId);

        // Convert Transaction entities to TransactionDTOs
        List<TransactionDTO> transactionDTOs = transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return transactionDTOs;
    }

    @GetMapping("/account/{accountId}")
    public List<TransactionDTO> getAccountTransactions(@PathVariable Integer accountId) {
        List<Transaction> transactions = transactionRepository.findTransactionsByAccountId(accountId);

        // Convert Transaction entities to TransactionDTOs
        List<TransactionDTO> transactionDTOs = transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return transactionDTOs;
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        Long sourceAccountID = null;
        Long destinationAccountID = null;

        if (transaction.getSourceAccount() != null) {
            sourceAccountID = Long.valueOf(transaction.getSourceAccount().getAccountID());
        }

        if (transaction.getDestinationAccount() != null) {
            destinationAccountID = Long.valueOf(transaction.getDestinationAccount().getAccountID());
        }

        return new TransactionDTO(
                transaction.getId(),
                transaction.getTransactionType(),
                transaction.getAmount(),
                transaction.getFormattedTransactionDate(),
                sourceAccountID,
                destinationAccountID
        );
    }

}

