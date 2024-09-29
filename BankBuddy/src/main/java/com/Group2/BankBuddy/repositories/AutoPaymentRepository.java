package com.Group2.BankBuddy.repositories;

import com.Group2.BankBuddy.Entity.Account;
import com.Group2.BankBuddy.Entity.AutoPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface AutoPaymentRepository extends JpaRepository<AutoPayment, Integer> {
    Optional<AutoPayment> findBybillPaymentId(Integer billPaymentId);

    List<AutoPayment> findBySrcAccount_AccountIDAndIsActive(Integer srcAccount, boolean isActive);

    List<AutoPayment> findByIsActive(boolean isActive);

}

