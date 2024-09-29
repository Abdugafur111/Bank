package com.Group2.BankBuddy.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

import com.Group2.BankBuddy.Entity.Account;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AutoPaymentDto {
    private Integer billPaymentId;
    private Integer srcAccount;
    private Integer destAccount;
    private String paymentFrequency;
    private BigDecimal amount;
    private String startDate;
    //private String endDate;
    private Boolean isActive;
    
}
