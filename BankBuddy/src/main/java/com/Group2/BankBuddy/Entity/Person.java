package com.Group2.BankBuddy.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "Person")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment from 1
    @Column(name = "PersonID")
    private Integer personID;

    @Column(name = "FirstName", nullable = false)
    @Size(max = 100)
    private String firstName;

    @Column(name = "LastName", nullable = false)
    @Size(max = 100)
    private String lastName;

    @Column(name = "Email", nullable = false)
    @Size(max = 100)
    private String email;

    @Column(name = "Password", nullable = false)
    @Size(max = 100)
    private String password;

    @Column(name = "Address", nullable = false)
    @Size(max = 100)
    private String address;

    @Column(name = "City", nullable = false)
    @Size(max = 100)
    private String city;

    @Column(name = "State", nullable = false)
    @Size(max = 100)
    private String state;

    @Column(name = "ZipCode", nullable = false)
    @Size(max = 100)
    private String zipCode;

    @Column(name = "Phone", nullable = false)
    @Size(max = 100)
    private String phone;

    @Column(name = "SSN")
    @Size(max = 100)
    private String ssn;

    @Column(name = "Role", nullable = false)
    @Size(max = 100)
    private String role;

    @Column(name = "DateOfBirth", nullable = false)
    private String dob;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CreationDate", nullable = false)
    private Date creationDate;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Account> accounts;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions;
}
