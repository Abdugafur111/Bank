package com.Group2.BankBuddy.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "Account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "nine_digit_id_generator")
    @GenericGenerator(
            name = "nine_digit_id_generator",
            strategy = "com.Group2.BankBuddy.services.NineDigitIdGenerator"
    )
    @Column(name = "AccountID")
    private Integer accountID;

    @Column(name = "AccountStatus", nullable = false)
    @Size(max = 100)
    private String accountStatus;

    @Column(name = "Balance", nullable = false)
    private BigDecimal balance;

    @Column(name = "AccountType", nullable = false)
    @Size(max = 100)
    private String accountType;

    @Column(name = "apy", nullable = false)
    private double apy;

    @ManyToOne
    @JoinColumn(name = "PersonID", referencedColumnName = "PersonID")
    private Person person;

    public void setExternalAccountID(Integer externalAccountID) {
        this.accountID = externalAccountID;
    }

}
