package com.Group2.BankBuddy;

import com.Group2.BankBuddy.Entity.Transaction;
import com.Group2.BankBuddy.dtos.AccountDto;
import com.Group2.BankBuddy.dtos.AccountRequestDto;
import com.Group2.BankBuddy.dtos.PersonDto;
import com.Group2.BankBuddy.dtos.PersonSignUpDto;
import com.Group2.BankBuddy.exceptions.InsufficientFundsException;
import com.Group2.BankBuddy.exceptions.PersonNotFoundException;
import com.Group2.BankBuddy.mappers.PersonMapper;
import com.Group2.BankBuddy.repositories.TransactionRepository;
import com.Group2.BankBuddy.services.AccountService;
import com.Group2.BankBuddy.mappers.AccountMapper;
import com.Group2.BankBuddy.Entity.Account;
import com.Group2.BankBuddy.Entity.Person;
import com.Group2.BankBuddy.repositories.AccountRepository;
import com.Group2.BankBuddy.repositories.PersonRepository;
import com.Group2.BankBuddy.services.PersonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.security.auth.login.AccountNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class AccountServiceTest {
    @Autowired
    private PersonService personService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private PersonMapper personMapper;

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountMapper accountMapper;

    @Autowired
    private TransactionRepository trans;


    private Person user;
    @Autowired
    private TransactionRepository transactionRepository;

    @BeforeEach
    public void setUp() {

    }

    @Test
    @DisplayName("Test getting an account by ID")
    public void testAddAccount() {
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();

        // Test registration
        PersonDto result = personService.register(personSignUpDto);

        List<Account> accounts =  accountRepository.findByPerson_PersonID(result.getPersonID());
        assertNotNull(accounts);
        assertEquals(2, accounts.size());

        Account addedAccount = accounts.get(0);
        assertNotNull(addedAccount);
        assertEquals("Active", addedAccount.getAccountStatus());
        assertEquals(0, addedAccount.getBalance().compareTo(BigDecimal.ZERO));

        boolean containsSaving = false;
        boolean containsChecking = false;

        for (Account account : accounts) {
            if ("Saving".equals(account.getAccountType())) {
                containsSaving = true;
            } else if ("Checking".equals(account.getAccountType())) {
                containsChecking = true;
            }
        }

        assertTrue(containsSaving);
        assertTrue(containsChecking);
        Person accountOwner = addedAccount.getPerson();
        assertNotNull(accountOwner);
        assertEquals(result.getPersonID(), accountOwner.getPersonID());
        assertEquals(personSignUpDto.getEmail(), accountOwner.getEmail());
        personService.deletePersonById(result.getPersonID());
    }
    @Test
    @DisplayName("Test getting an account by ID")
    public void testGetAccountById() {
        // Create a test person
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        PersonDto personDto = personService.register(personSignUpDto);

        // Create a test account
        List<Account> accounts = accountRepository.findByPerson_PersonID(personDto.getPersonID());
        assertNotNull(accounts);
        assertEquals(2, accounts.size());
        Account testAccount = accounts.get(0);

        // Test getAccountById
        AccountDto retrievedAccountDto = accountService.getAccountById(testAccount.getAccountID());

        // Perform assertions
        assertNotNull(retrievedAccountDto);
        assertEquals(testAccount.getAccountID(), retrievedAccountDto.getAccountId());
        assertEquals(testAccount.getAccountStatus(), retrievedAccountDto.getAccountStatus());
        assertEquals(testAccount.getBalance(), retrievedAccountDto.getBalance());
        assertEquals(testAccount.getAccountType(), retrievedAccountDto.getAccountType());
        PersonDto accountOwner = retrievedAccountDto.getPerson();
        assertNotNull(accountOwner);
        assertEquals(personDto.getPersonID(), accountOwner.getPersonID());
       personService.deletePersonById(personDto.getPersonID());
    }

    @Test
    @DisplayName("Test deactivating an account")
    public void testDeactivateAccount() throws PersonNotFoundException, AccountNotFoundException {
        // Register a new person
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Add accounts for the registered person
        List<AccountDto> addedAccounts = accountService.getAccountsByPersonId(registeredPerson.getPersonID());
        assertNotNull(addedAccounts);
        assertEquals(2, addedAccounts.size());

        // Get the first account for testing
        AccountDto account = addedAccounts.get(0);

        // Deactivate the account
        AccountDto deactivatedAccount = accountService.deactivateAccount(account.getAccountId());

        // Ensure the account is deactivated and has an "Inactive" status
        assertNotNull(deactivatedAccount);
        assertEquals("Inactive", deactivatedAccount.getAccountStatus());

        // Clean up: Delete the registered person
        personService.deletePersonById(registeredPerson.getPersonID());
    }


    @Test
    @DisplayName("Test fund transfer between accounts")
    public void testTransferFunds() throws PersonNotFoundException, AccountNotFoundException, InsufficientFundsException {
        // Register source person
        PersonSignUpDto sourcePersonDto = createTestPersonSignUpDto();
        PersonDto sourcePerson = personService.register(sourcePersonDto);

        // Register destination person with a different email
        PersonSignUpDto destinationPersonDto = createTestPersonSignUpDto();
        destinationPersonDto.setEmail("destination@bankbuddy.com");  // Change the email for the second person
        PersonDto destinationPerson = personService.register(destinationPersonDto);

        // Add accounts for both users
        List<AccountDto> sourceAccounts = accountService.getAccountsByPersonId(sourcePerson.getPersonID());
        List<AccountDto> destinationAccounts = accountService.getAccountsByPersonId(destinationPerson.getPersonID());

        assertNotNull(sourceAccounts);
        assertNotNull(destinationAccounts);

        assertEquals(2, sourceAccounts.size());
        assertEquals(2, destinationAccounts.size());

        // Transfer funds from the first account of the source user to the first account of the destination user
        AccountDto sourceAccount = sourceAccounts.get(0);
        AccountDto destinationAccount = destinationAccounts.get(0);

        // Deposit an amount greater than the transfer amount into the source account
        BigDecimal depositAmount = new BigDecimal("2000");
        accountService.deposit(sourcePerson.getPersonID(), sourceAccount.getAccountId(), depositAmount);

        // Verify the balance after the deposit
        AccountDto updatedSourceAccount = accountService.getAccountById(sourceAccount.getAccountId());
        assertNotNull(updatedSourceAccount);
        assertEquals(new BigDecimal("2000.00"), updatedSourceAccount.getBalance());

        // Transfer funds now
        BigDecimal transferAmount = new BigDecimal("1000");
        accountService.transferFunds(sourceAccount.getAccountId(), sourcePerson.getPersonID(),
                destinationAccount.getAccountId(), transferAmount);

        // Verify the balances after the transfer
        updatedSourceAccount = accountService.getAccountById(sourceAccount.getAccountId());
        AccountDto updatedDestinationAccount = accountService.getAccountById(destinationAccount.getAccountId());

        assertNotNull(updatedSourceAccount);
        assertNotNull(updatedDestinationAccount);

        assertEquals(new BigDecimal("1000.00"), updatedSourceAccount.getBalance());
        assertEquals(new BigDecimal("1000.00"), updatedDestinationAccount.getBalance());

        trans.deleteAll();
        // Clean up: Delete the registered users
        personService.deletePersonById(sourcePerson.getPersonID());
        personService.deletePersonById(destinationPerson.getPersonID());
    }




    @Test
    @DisplayName("Test getting accounts by person ID")
    public void testGetAccountsByPersonId() {
        // Register a new person
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Add accounts for the registered person
        List<AccountDto> addedAccounts = accountService.getAccountsByPersonId(registeredPerson.getPersonID());

        // Ensure the addedAccounts list is not null and contains the expected number of accounts
        assertNotNull(addedAccounts);
        assertEquals(2, addedAccounts.size());

        for (AccountDto account : addedAccounts) {
            assertNotNull(account);
            assertEquals("Active", account.getAccountStatus());
            assertEquals(0, account.getBalance().compareTo(BigDecimal.ZERO));

            // Adjust based on your logic for setting the account type
            assertTrue("Saving".equals(account.getAccountType()) || "Checking".equals(account.getAccountType()));

            // Assert the person details
            assertNotNull(account.getPerson());
            assertEquals(registeredPerson.getPersonID(), account.getPerson().getPersonID());
            assertEquals(registeredPerson.getEmail(), account.getPerson().getEmail());
        }

        // Clean up: Delete the registered person
        personService.deletePersonById(registeredPerson.getPersonID());
    }

    @Test
    @DisplayName("Test depositing funds")
    public void testDeposit() throws PersonNotFoundException, AccountNotFoundException, AccountNotFoundException {
        // Register a new person
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Add accounts for the registered person
        List<AccountDto> addedAccounts = accountService.getAccountsByPersonId(registeredPerson.getPersonID());
        assertNotNull(addedAccounts);
        assertEquals(2, addedAccounts.size());

        // Get the first two accounts for testing
        AccountDto account1 = addedAccounts.get(0);
        AccountDto account2 = addedAccounts.get(1);

        // Deposit 3000 to the source account
        BigDecimal depositAmount3000 = new BigDecimal("3000");
        AccountDto updateAccount1 = accountService.deposit(
                registeredPerson.getPersonID(), account1.getAccountId(), depositAmount3000);
        System.out.println(updateAccount1.getBalance());


        // Deposit 5000 to the destination account
        BigDecimal depositAmount5000 = new BigDecimal("5000");
        AccountDto updateAccount2 = accountService.deposit(
                registeredPerson.getPersonID(), account2.getAccountId(), depositAmount5000);

        // Ensure the destination account balance is updated correctly after the deposit
        assertNotNull(updateAccount2);
        assertNotNull(updateAccount1);
        assertEquals(new BigDecimal("3000.00"), updateAccount1.getBalance());
        assertEquals(new BigDecimal("5000.00"), updateAccount2.getBalance());

        // Clean up: Delete the registered person
        personService.deletePersonById(registeredPerson.getPersonID());
    }

    @Test
    @DisplayName("Test withdrawing funds")
    public void testWithdraw() throws PersonNotFoundException, AccountNotFoundException, InsufficientFundsException {
        // Register a new person
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Add accounts for the registered person
        List<AccountDto> addedAccounts = accountService.getAccountsByPersonId(registeredPerson.getPersonID());
        assertNotNull(addedAccounts);
        assertEquals(2, addedAccounts.size());

        // Get the first account for testing
        AccountDto account = addedAccounts.get(0);

        // Deposit 5000 to the account
        BigDecimal depositAmount5000 = new BigDecimal("5000");
        AccountDto updateAccount = accountService.deposit(
                registeredPerson.getPersonID(), account.getAccountId(), depositAmount5000);
        System.out.println(updateAccount.getBalance());

        // Withdraw 3000 from the account
        BigDecimal withdrawAmount3000 = new BigDecimal("3000");
        AccountDto updatedAccountAfterWithdrawal = accountService.withdraw(
                registeredPerson.getPersonID(), account.getAccountId(), withdrawAmount3000);
        System.out.println(updatedAccountAfterWithdrawal.getBalance());

        // Ensure the account balance is updated correctly after the deposit and withdrawal
        assertNotNull(updatedAccountAfterWithdrawal);
        assertEquals(new BigDecimal("2000.00"), updatedAccountAfterWithdrawal.getBalance());

        // Clean up: Delete the registered person
        personService.deletePersonById(registeredPerson.getPersonID());
    }

    @Test
    @DisplayName("Test getting userID for an account")
    public void testGetUserIdForAccount(){
        // Register a new person
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Add an account for the registered person
        List<AccountDto> addedAccounts = accountService.getAccountsByPersonId(registeredPerson.getPersonID());
        assertNotNull(addedAccounts);
        assertEquals(2, addedAccounts.size());

        // Get the first account for testing
        AccountDto account = addedAccounts.get(0);

        // Get the userID for the account
        Integer userId = accountService.getUserIdForAccount(account.getAccountId());

        // Ensure the userID is correct
        assertNotNull(userId);
        assertEquals(registeredPerson.getPersonID(), userId);

        // Clean up: Delete the registered person
        personService.deletePersonById(registeredPerson.getPersonID());
    }

    @Test
    @DisplayName("Test withdrawing funds and saving transaction")
    public void testWithdrawAndSaveTransaction() throws PersonNotFoundException, AccountNotFoundException, InsufficientFundsException {
        // Register a new person
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Add an account for the registered person
        List<AccountDto> addedAccounts = accountService.getAccountsByPersonId(registeredPerson.getPersonID());
        assertNotNull(addedAccounts);
        assertEquals(2, addedAccounts.size());

        // Get the first account for testing
        AccountDto account = addedAccounts.get(0);

        // Deposit 5000 to the account
        BigDecimal depositAmount5000 = new BigDecimal("5000.00");
        AccountDto updatedAccountAfterDeposit = accountService.deposit(
                registeredPerson.getPersonID(), account.getAccountId(), depositAmount5000);

        // Withdraw 3000 from the account
        BigDecimal withdrawAmount3000 = new BigDecimal("3000.00");
        AccountDto updatedAccountAfterWithdrawal = accountService.withdraw(
                registeredPerson.getPersonID(), account.getAccountId(), withdrawAmount3000);

        // Ensure the account balance is updated correctly after the deposit and withdrawal
        assertNotNull(updatedAccountAfterWithdrawal);
        assertEquals(new BigDecimal("2000.00"), updatedAccountAfterWithdrawal.getBalance());

        // Check if the transaction is saved
        List<Transaction> transactions = transactionRepository.findAll();
        assertNotNull(transactions);
        assertEquals(2, transactions.size());

        Transaction withdrawalTransaction = transactions.get(1);
        assertNotNull(withdrawalTransaction);
        assertEquals(registeredPerson.getPersonID(), withdrawalTransaction.getPerson().getPersonID());
        assertEquals(account.getAccountId(), withdrawalTransaction.getSourceAccount().getAccountID());
        assertEquals(withdrawAmount3000, withdrawalTransaction.getAmount());
        assertEquals("Withdrawal", withdrawalTransaction.getTransactionType());

        // Clean up: Delete the registered person
        personService.deletePersonById(registeredPerson.getPersonID());
    }

    @Test
    @DisplayName("Test depositing funds and saving transaction")
    public void testDepositAndSaveTransaction() throws PersonNotFoundException, AccountNotFoundException {
        // Register a new person
        PersonSignUpDto personSignUpDto = createTestPersonSignUpDto();
        PersonDto registeredPerson = personService.register(personSignUpDto);

        // Add an account for the registered person
        List<AccountDto> addedAccounts = accountService.getAccountsByPersonId(registeredPerson.getPersonID());
        assertNotNull(addedAccounts);
        assertEquals(2, addedAccounts.size());

        // Get the first account for testing
        AccountDto account = addedAccounts.get(0);

        // Deposit 5000 to the account
        BigDecimal depositAmount5000 = new BigDecimal("5000.00");
        AccountDto updatedAccountAfterDeposit = accountService.deposit(
                registeredPerson.getPersonID(), account.getAccountId(), depositAmount5000);

        // Ensure the account balance is updated correctly after the deposit
        assertNotNull(updatedAccountAfterDeposit);
        assertEquals(new BigDecimal("5000.00"), updatedAccountAfterDeposit.getBalance());

        // Check if the transaction is saved
        List<Transaction> transactions = transactionRepository.findAll();
        assertNotNull(transactions);
        assertEquals(1, transactions.size());

        Transaction depositTransaction = transactions.get(0);
        assertNotNull(depositTransaction);
        assertEquals(registeredPerson.getPersonID(), depositTransaction.getPerson().getPersonID());
        assertEquals(account.getAccountId(), depositTransaction.getDestinationAccount().getAccountID());
        assertEquals(depositAmount5000, depositTransaction.getAmount());
        assertEquals("Deposit", depositTransaction.getTransactionType());

        // Clean up: Delete the registered person
        personService.deletePersonById(registeredPerson.getPersonID());
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
}
