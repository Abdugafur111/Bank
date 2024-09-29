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
public class AccountDto {
    private Integer accountId;
    private String accountStatus;
    private BigDecimal balance;
    private String accountType;
    private PersonDto person;
    private Double apy;
}
