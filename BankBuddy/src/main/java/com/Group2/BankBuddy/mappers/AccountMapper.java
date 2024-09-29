package com.Group2.BankBuddy.mappers;

import com.Group2.BankBuddy.Entity.Account;
import com.Group2.BankBuddy.dtos.AccountDto;
import com.Group2.BankBuddy.dtos.AccountRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);

    @Mapping(source = "person.firstName", target = "person.firstName")
    @Mapping(source = "person.lastName", target = "person.lastName")
    @Mapping(source = "accountID", target = "accountId")
    @Mapping(source = "apy", target = "apy")
    AccountDto toDto(Account account);

    @Mapping(target = "person", ignore = true) // Ignore mapping of the Person entity
    Account toEntity(AccountDto accountDto);

    @Mapping(target = "accountStatus", ignore = true)
    Account toEntity(String accountType);
}
