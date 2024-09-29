package com.Group2.BankBuddy.controller;

import com.Group2.BankBuddy.dtos.*;
import com.Group2.BankBuddy.exceptions.PersonNotFoundException;
import com.Group2.BankBuddy.services.AccountService;
import com.Group2.BankBuddy.exceptions.AutoPaymentNotFoundException;
import com.Group2.BankBuddy.exceptions.InsufficientFundsException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/add")
    public ResponseEntity<AccountDto> addAccount(@RequestBody AccountRequestDto requestDto) {
        AccountDto createdAccount = accountService.addAccount(requestDto);
        return ResponseEntity.ok(createdAccount);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountDto> getAccountById(@PathVariable Integer accountId) {
        AccountDto account = accountService.getAccountById(accountId);
        if (account != null) {
            return ResponseEntity.ok(account);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/byPerson/{personId}")
    public ResponseEntity<List<AccountDto>> getAccountsByPersonId(@PathVariable Integer personId) {
        List<AccountDto> accounts = accountService.getAccountsByPersonId(personId);
        return ResponseEntity.ok(accounts);
    }


    @PostMapping("/{accountId}/deactivate")
    public ResponseEntity<AccountDto> deactivateAccount(@PathVariable Integer accountId) throws AccountNotFoundException {
        AccountDto deactivatedAccount = accountService.deactivateAccount(accountId);
        return ResponseEntity.ok(deactivatedAccount);
    }

    @PostMapping("/deposit")
    public ResponseEntity<AccountDto> depositMoney(@RequestBody AccountDepositRequest request) {
        try {
            AccountDto updatedAccount = accountService.deposit(request.getUserId(), request.getAccountId(), request.getAmount());
            return ResponseEntity.ok(updatedAccount);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Object> withdrawMoney(@RequestBody AccountWithdrawRequest request) {
        try {
            AccountDto updatedAccount = accountService.withdraw(request.getUserId(), request.getAccountId(), request.getAmount());
            return ResponseEntity.ok(updatedAccount);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (InsufficientFundsException e) {
            ErrorResponseDto errorResponse = new ErrorResponseDto(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferFunds(@RequestBody TransferRequest transferRequest) {
        try {
            accountService.transferFunds(
                    transferRequest.getSourceAccountId(),
                    transferRequest.getSourceUserId(),
                    transferRequest.getDestinationAccountId(),
                    transferRequest.getAmount()
            );
            return ResponseEntity.ok("Funds transferred successfully");
        } catch (AccountNotFoundException e) {
            return ResponseEntity.badRequest().body("Account not found");
        } catch (InsufficientFundsException e) {
            return ResponseEntity.badRequest().body("Insufficient funds");
        } catch (PersonNotFoundException e) {
            return ResponseEntity.badRequest().body("Person not found");
        }
    }

    @PostMapping("/newAutoPayment")
    public ResponseEntity<AutoPaymentDto> createAutoPayment(@RequestBody AutoPaymentDto autoPaymentRequest) {
        try {
            AutoPaymentDto autoPayment = accountService.createAutoPayment(autoPaymentRequest); 
            return ResponseEntity.ok(autoPayment);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/cancelAutoPayment/{paymentId}")
    public ResponseEntity<AutoPaymentDto> cancelAutoPayment(@PathVariable Integer paymentId) throws AutoPaymentNotFoundException {
        try{
            AutoPaymentDto request = new AutoPaymentDto();
            request.setIsActive(false);
            AutoPaymentDto canceledPayment = accountService.editAutoPayment(paymentId, request);
            return ResponseEntity.ok(canceledPayment);
        } catch (AutoPaymentNotFoundException e){
             return ResponseEntity.notFound().build();
        }catch (AccountNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/editAutoPayment/{paymentId}")
    public ResponseEntity<AutoPaymentDto> editAutoPayment(@PathVariable Integer paymentId, @RequestBody AutoPaymentDto request) throws AutoPaymentNotFoundException {
        try{
            AutoPaymentDto canceledPayment = accountService.editAutoPayment(paymentId, request);
            return ResponseEntity.ok(canceledPayment);
        } catch (AutoPaymentNotFoundException e){
             return ResponseEntity.notFound().build();
        }catch (AccountNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/ActivePaymentsByAccountId")
    public ResponseEntity<List<AutoPaymentDto>> getActivePaymentsByAccount(@RequestBody AutoPaymentDto request) {
        try{
            List<AutoPaymentDto> payments = accountService.getActiveAutoPaymentsByAccount(request.getSrcAccount());
            return ResponseEntity.ok(payments);
        } catch (AccountNotFoundException e){
             return ResponseEntity.notFound().build();
        }  
    }

    @GetMapping("/allActivePaymentsByPerson/{personId}")
    public ResponseEntity<List<AutoPaymentDto>> getActivePaymentsByPerson(@PathVariable Integer personId) {
        try{
            List<AutoPaymentDto> payments = accountService.getActiveAutoPaymentsByPerson(personId);
            return ResponseEntity.ok(payments);
        } catch (AutoPaymentNotFoundException e){
             return ResponseEntity.notFound().build();
        }  catch (AccountNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

}
