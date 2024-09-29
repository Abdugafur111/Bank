package com.Group2.BankBuddy.mappers;


import com.Group2.BankBuddy.Entity.AutoPayment;
import com.Group2.BankBuddy.Entity.Person;
import com.Group2.BankBuddy.dtos.AutoPaymentDto;

import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AutoPaymentMapper {


    // @IterableMapping(elementTargetType = AutoPaymentDto.class)
    // List<AutoPaymentDto> toAutoPaymentDtoList(List<AutoPayment> autoPayments);

    //   @Mapping(target = "srcAccount" ,source = "srcAccount.accountID") 

    @Mapping(target = "srcAccount", source = "srcAccount.accountID") 
    AutoPaymentDto toDto(AutoPayment autoPayment);






}
