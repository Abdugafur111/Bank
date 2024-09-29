package com.Group2.BankBuddy.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonSignUpDto {

    @NotEmpty
    private String firstName;

    @NotEmpty
    private String lastName;

    @NotEmpty
    private String email;

    @NotEmpty
    private String phone;

    @NotEmpty
    private String address;

    private String ssn;

    @NotEmpty
    private String password;

    @NotEmpty
    private String state;

    @NotEmpty
    private String city;

    @NotEmpty
    private String zip;

    @NotEmpty
    private String dob;

    @NotEmpty
    private String accountType;

    private String role;
}
