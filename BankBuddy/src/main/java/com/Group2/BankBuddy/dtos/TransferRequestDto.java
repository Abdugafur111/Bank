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
public class TransferRequestDto {
    private Integer sourceAccountId;
    private Integer sourceUserId;
    private Integer destinationAccountId;
    private Integer destinationUserId;
    private BigDecimal amount;
}
