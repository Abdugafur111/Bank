package com.Group2.BankBuddy.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDepositRequest {
    private Integer userId;
    private Integer accountId;
    private BigDecimal amount;
}