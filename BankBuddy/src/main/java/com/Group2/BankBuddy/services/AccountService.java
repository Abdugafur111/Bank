package com.Group2.BankBuddy.services;

import com.Group2.BankBuddy.Entity.Account;
import com.Group2.BankBuddy.Entity.AutoPayment;
import com.Group2.BankBuddy.Entity.Person;
import com.Group2.BankBuddy.Entity.Transaction;
import com.Group2.BankBuddy.dtos.AccountDto;
import com.Group2.BankBuddy.dtos.AccountRequestDto;
import com.Group2.BankBuddy.dtos.AutoPaymentDto;
import com.Group2.BankBuddy.exceptions.AutoPaymentNotFoundException;
import com.Group2.BankBuddy.exceptions.InsufficientFundsException;
import com.Group2.BankBuddy.exceptions.PersonNotFoundException;
import com.Group2.BankBuddy.mappers.AccountMapper;
import com.Group2.BankBuddy.mappers.AutoPaymentMapper;
import com.Group2.BankBuddy.repositories.AccountRepository;
import com.Group2.BankBuddy.repositories.AutoPaymentRepository;
import com.Group2.BankBuddy.repositories.PersonRepository;
import com.Group2.BankBuddy.repositories.TransactionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.scheduling.annotation.Scheduled;

import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountService {

    private final AccountRepository accountRepository;
    private final PersonRepository personRepository;
    private final TransactionRepository transactionRepository;
    private final AccountMapper accountMapper;
    private final AutoPaymentMapper autoPaymentMapper;
    private final AutoPaymentRepository autoPaymentRepository;



    public AccountDto addAccount(AccountRequestDto requestDto) {
        // Retrieve the user (Person) by their ID
        Person user = personRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new PersonNotFoundException("User not found"));

        // Create a new Account entity
        Account account = accountMapper.toEntity(requestDto.getAccountType());
        account.setPerson(user);
        account.setAccountStatus("Active");
        account.setBalance(BigDecimal.ZERO);

        if (account.getAccountType().equals("Checking")){
            account.setApy(2.0);
        }else{
            account.setApy(4.0);
        }

        // Save the new Account entity
        Account savedAccount = accountRepository.save(account);

        return accountMapper.toDto(savedAccount);
    }

    public AccountDto getAccountById(Integer accountId) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        return accountOptional.map(accountMapper::toDto).orElse(null);
    }

    public List<AccountDto> getAccountsByPersonId(Integer personId) {
        List<Account> accounts = accountRepository.findByPerson_PersonID(personId);
        return accounts.stream()
                .map(accountMapper::toDto)
                .collect(Collectors.toList());
    }


    public AccountDto deactivateAccount(Integer accountId) throws AccountNotFoundException {
        Optional<Account> accountOptional = accountRepository.findById(accountId);
        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            account.setAccountStatus("Inactive");
            Account deactivatedAccount = accountRepository.save(account);
            return accountMapper.toDto(deactivatedAccount);
        } else {
            throw new AccountNotFoundException("Account not found");
        }
    }


    public AccountDto deposit(Integer userId, Integer accountId, BigDecimal amount) throws AccountNotFoundException {
        // You might want to validate that the user owns the account here
         Optional<Person> personOptional = personRepository.findById(userId);
        if(!personOptional.isPresent()){
            throw new PersonNotFoundException("Person with ID " + userId + " not found");
        }

        Optional<Account> accountOptional = accountRepository.findById(accountId);

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            BigDecimal currentBalance = account.getBalance();

            BigDecimal newBalance = currentBalance.add(amount);
            account.setBalance(newBalance);

            Account updatedAccount = accountRepository.save(account);


            Transaction depositTransaction = new Transaction();
            Person person = personOptional.get();
            depositTransaction.setPerson(person);

            depositTransaction.setDestinationAccount(account);
            depositTransaction.setAmount(amount);
            depositTransaction.setTransactionType("Deposit");
            depositTransaction.setTransactionDate(new Date());
            transactionRepository.save(depositTransaction);


            return accountMapper.toDto(updatedAccount);
        } else {
            throw new AccountNotFoundException("Account with ID " + accountId + " not found");
        }
    }


    public AccountDto withdraw(Integer userId, Integer accountId, BigDecimal amount) throws AccountNotFoundException, InsufficientFundsException {
        // You might want to validate that the user owns the account here

        Optional<Person> personOptional = personRepository.findById(userId);
        if(!personOptional.isPresent()){
            throw new PersonNotFoundException("Person with ID " + userId + " not found");
        }

        Optional<Account> accountOptional = accountRepository.findById(accountId);

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            BigDecimal currentBalance = account.getBalance();

            if (currentBalance.compareTo(amount) < 0) {
                throw new InsufficientFundsException("Insufficient funds");
            }

            BigDecimal newBalance = currentBalance.subtract(amount);
            account.setBalance(newBalance);

            Account updatedAccount = accountRepository.save(account);


            Transaction withdrawalTransaction = new Transaction();
            Person person = personOptional.get();
            withdrawalTransaction.setPerson(person);
            withdrawalTransaction.setSourceAccount(account);
            withdrawalTransaction.setAmount(amount);
            withdrawalTransaction.setTransactionType("Withdrawal");
            withdrawalTransaction.setTransactionDate(new Date());
            transactionRepository.save(withdrawalTransaction);

            return accountMapper.toDto(updatedAccount);
        } else {
            throw new AccountNotFoundException("Account with ID " + accountId + " not found");
        }
    }


    public void transferFunds(Integer sourceAccountId, Integer sourceUserId, Integer destinationAccountId, BigDecimal amount) throws AccountNotFoundException, InsufficientFundsException {
        // Check if source and destination users exist
        Person sourceUser = personRepository.findById(sourceUserId)
                .orElseThrow(() -> new PersonNotFoundException("Source user not found"));
        Integer destinationUserId = getUserIdForAccount(destinationAccountId);
        Person destinationUser = personRepository.findById(destinationUserId)
                .orElseThrow(() -> new PersonNotFoundException("Destination user not found"));

        // Check if source and destination accounts exist
        Account sourceAccount = accountRepository.findById(sourceAccountId)
                .orElseThrow(() -> new AccountNotFoundException("Source account not found"));
        Account destinationAccount = accountRepository.findById(destinationAccountId)
                .orElseThrow(() -> new AccountNotFoundException("Destination account not found"));

        // Check if source account has sufficient funds
        BigDecimal sourceBalance = sourceAccount.getBalance();
        if (sourceBalance.compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds in the source account");
        }

        // Perform the fund transfer
        BigDecimal newSourceBalance = sourceBalance.subtract(amount);
        sourceAccount.setBalance(newSourceBalance);
        BigDecimal destinationBalance = destinationAccount.getBalance();
        BigDecimal newDestinationBalance = destinationBalance.add(amount);
        destinationAccount.setBalance(newDestinationBalance);

        // Check if its an external or internal transfer based on user IDs
        if(sourceUserId.equals(destinationUserId)){
            // Create a single transaction entity for both accounts
            Transaction transferTransaction = new Transaction();

            transferTransaction.setSourceAccount(sourceAccount);
            transferTransaction.setPerson(sourceUser);
            transferTransaction.setDestinationAccount(destinationAccount);
            transferTransaction.setAmount(amount);
            transferTransaction.setTransactionType("Transfer");
            transferTransaction.setTransactionDate(new Date());

            // Save the updated accounts and the transaction
            transactionRepository.save(transferTransaction);
            accountRepository.save(sourceAccount);
            accountRepository.save(destinationAccount);
        } else {
            // External Transfer: Between different users
            // Create a transaction for the source account and associate it with the source user
            Transaction sourceTransaction = new Transaction();
            sourceTransaction.setSourceAccount(sourceAccount);
            sourceTransaction.setDestinationAccount(destinationAccount);
            sourceTransaction.setAmount(amount);
            sourceTransaction.setTransactionType("Transfer");
            sourceTransaction.setTransactionDate(new Date());
            sourceTransaction.setPerson(sourceUser);

            // Create a transaction for the destination account and associate it with the destination user
            Transaction destinationTransaction = new Transaction();
            destinationTransaction.setDestinationAccount(destinationAccount);
            destinationTransaction.setSourceAccount(sourceAccount);
            destinationTransaction.setAmount(amount);
            destinationTransaction.setTransactionType("Transfer");
            destinationTransaction.setTransactionDate(new Date());
            destinationTransaction.setPerson(destinationUser);

            // Save both transactions
            transactionRepository.save(sourceTransaction);
            transactionRepository.save(destinationTransaction);
            accountRepository.save(sourceAccount);
            accountRepository.save(destinationAccount);
        }

    }



    public AutoPaymentDto createAutoPayment(AutoPaymentDto autoPaymentRequest) throws AccountNotFoundException {
        Account srcAccount = accountRepository.findById(autoPaymentRequest.getSrcAccount())
                .orElseThrow(() -> new AccountNotFoundException("Source Account not found"));

        Account destAccount = accountRepository.findById(autoPaymentRequest.getDestAccount())
                .orElseThrow(() -> new AccountNotFoundException("Destination Account not found"));   


        AutoPayment autoPayment = new AutoPayment();
        autoPayment.setSrcAccount(srcAccount);
        autoPayment.setDestAccount(autoPaymentRequest.getDestAccount());
        // autoPayment.setSrctUserID(autoPaymentRequest.getSrcUserId());
        // autoPayment.setDestUserID(autoPaymentRequest.getDestUserId());
        autoPayment.setPaymentFrequency(autoPaymentRequest.getPaymentFrequency());
        autoPayment.setAmount(autoPaymentRequest.getAmount());
        autoPayment.setStartDate(autoPaymentRequest.getStartDate());
        //autoPayment.setEndDate(autoPaymentRequest.getEndDate());
        autoPayment.setIsActive(true); // Auto payment is active when created


        // Save the auto payment record
        AutoPayment savedAutoPayment = autoPaymentRepository.save(autoPayment);

        return autoPaymentMapper.toDto(savedAutoPayment);
    }

    public AutoPaymentDto editAutoPayment(Integer paymentId, AutoPaymentDto updatedPaymentDto) throws AutoPaymentNotFoundException, AccountNotFoundException {
        Optional<AutoPayment> autoPaymentOptional = autoPaymentRepository.findBybillPaymentId(paymentId);

        if (autoPaymentOptional.isPresent()) {
            AutoPayment existingPayment = autoPaymentOptional.get();

            if (updatedPaymentDto.getSrcAccount() != null){
                Account srcAccount = accountRepository.findById(updatedPaymentDto.getSrcAccount())
                .orElseThrow(() -> new AccountNotFoundException("Source Account not found"));
                existingPayment.setSrcAccount(srcAccount);
            }
            if (updatedPaymentDto.getDestAccount() != null){
                Account destAccount = accountRepository.findById(updatedPaymentDto.getDestAccount())
                .orElseThrow(() -> new AccountNotFoundException("Destination Account not found"));
                existingPayment.setDestAccount(updatedPaymentDto.getDestAccount());
            }
            if (updatedPaymentDto.getPaymentFrequency() != null){
                existingPayment.setPaymentFrequency(updatedPaymentDto.getPaymentFrequency());
            }
            if (updatedPaymentDto.getAmount() != null){
                existingPayment.setAmount(updatedPaymentDto.getAmount());
            }
            if (updatedPaymentDto.getStartDate() != null){
                existingPayment.setStartDate(updatedPaymentDto.getStartDate());
            }
            if (updatedPaymentDto.getIsActive() != null){
                existingPayment.setIsActive(updatedPaymentDto.getIsActive());
            }

            AutoPayment updatedPayment = autoPaymentRepository.save(existingPayment);
            return autoPaymentMapper.toDto(updatedPayment);
        } else {
            throw new AutoPaymentNotFoundException("Bill not found");
        }
    }

    public List<AutoPaymentDto> getActiveAutoPaymentsByAccount(Integer srcAccountId) throws AccountNotFoundException {
        Optional<Account> accountOptional = accountRepository.findById(srcAccountId);
        if (accountOptional.isPresent()) {
            List<AutoPayment> payments = autoPaymentRepository.findBySrcAccount_AccountIDAndIsActive(srcAccountId, true);
            return payments.stream()
                    .map(autoPaymentMapper::toDto)
                    .collect(Collectors.toList());
        }else {
            throw new AccountNotFoundException("Account not found");
        }
    }

    public List<AutoPaymentDto> getActiveAutoPaymentsByPerson(Integer personId) throws AccountNotFoundException {

        List<AccountDto> accounts = getAccountsByPersonId(personId);
        List<AutoPaymentDto> payments = getActiveAutoPaymentsByAccount(accounts.get(0).getAccountId());
        accounts.remove(0);
        for(AccountDto account: accounts){
           payments.addAll(getActiveAutoPaymentsByAccount(account.getAccountId())); 
        }

        return payments;
    }
    //@Scheduled(cron = "0 * * * * ?") // Run every minute for testing
    @Scheduled(cron = "0 0 0 * * ?") // Run once every day at midnight
    public void processScheduledPayments() {
        List<AutoPayment> activeAutoPayments = autoPaymentRepository.findByIsActive(true);
        
        for (AutoPayment autoPayment : activeAutoPayments) {
            if (shouldPerformTransaction(autoPayment)) {
                performTransaction(autoPayment);
            }
        }
    }

    public boolean shouldPerformTransaction(AutoPayment autoPayment) {
        String startDateString = autoPayment.getStartDate();
        String frequency = autoPayment.getPaymentFrequency();

        LocalDate startDate = LocalDate.parse(startDateString, DateTimeFormatter.ofPattern("MM-dd-yy"));
        LocalDate currentDate = LocalDate.now();

        long daysBetween = ChronoUnit.DAYS.between(startDate, currentDate);

        switch (frequency.toLowerCase()) {
            case "weekly":
                return daysBetween % 7 == 0;
            case "bi-weekly":
                return daysBetween % 14 == 0;
            case "monthly":
                return daysBetween % 30 == 0; // Assuming a month is approximately 30 days
            case "yearly":
                return daysBetween % 365 == 0;
            default:
                throw new IllegalArgumentException("Unsupported payment frequency");
        }
    }

    public void performTransaction(AutoPayment payment) {
        try {
        transferFunds(
            payment.getSrcAccount().getAccountID(),
            getUserIdForAccount(payment.getSrcAccount().getAccountID()),
            payment.getDestAccount(),
            payment.getAmount());
        } catch (InsufficientFundsException e){

        }catch (AccountNotFoundException e){

        }
        
    }

    public Integer getUserIdForAccount(Integer accountID){
        Optional<Account> accountOptional = accountRepository.findById(accountID);
        Account account = accountOptional.get();
        if(account != null){
            return account.getPerson().getPersonID();
        } else {
            return null;
        }

    }
}

