package com.Group2.BankBuddy.mappers;


import com.Group2.BankBuddy.Entity.Person;
import com.Group2.BankBuddy.dtos.PersonDto;
import com.Group2.BankBuddy.dtos.PersonSignUpDto;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PersonMapper {


    @IterableMapping(elementTargetType = PersonDto.class)
    List<PersonDto> toPersonDtoList(List<Person> persons);


    @Mapping(source = "dob", target = "dob")
    PersonDto toPersonDto(Person person);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "ssn", source = "ssn")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "state", source = "state")
    @Mapping(target = "city", source = "city")
    @Mapping(target = "zipCode", source = "zip")
    @Mapping(target = "dob", source = "dob")
    Person signUpDtoToPerson(PersonSignUpDto signUpDto);




}
