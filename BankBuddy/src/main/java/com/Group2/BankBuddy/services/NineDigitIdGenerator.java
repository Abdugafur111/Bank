package com.Group2.BankBuddy.services;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.util.Random;

public class NineDigitIdGenerator implements IdentifierGenerator {
    @Override
    public Serializable generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o) throws HibernateException {
        int id;
        do {
            id = 100_000_000 + new Random().nextInt(900_000_000);
        } while (String.valueOf(id).length() != 9);
        return id;
    }
}




