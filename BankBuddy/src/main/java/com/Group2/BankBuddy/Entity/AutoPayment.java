package com.Group2.BankBuddy.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "AutoPayment")
public class AutoPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BillPaymentId")
    private Integer billPaymentId;

    @ManyToOne
    @JoinColumn(name = "SrcAccountID", referencedColumnName = "AccountID")
    private Account srcAccount;

    // @Column(name = "SrcUserID")
    // private Integer srctUserID;

    @Column(name = "DestAccountID")
    private Integer destAccount;
    
    // @Column(name = "DestUserID")
    // private Integer destUserID;

    @Column(name = "PaymentFrequency")
    private String paymentFrequency;

    @Column(name = "Amount")
    private BigDecimal amount;

    @Column(name = "StartDate")
    private String startDate;

    // @Column(name = "EndDate")
    // private String endDate;

    @Column(name = "IsActive")
    private Boolean isActive;

}

