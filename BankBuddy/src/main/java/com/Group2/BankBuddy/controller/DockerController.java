package com.Group2.BankBuddy.controller;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/docker")
public class DockerController {


    @GetMapping("/rest")
    public String rest(){
        return "REST inside Docker";
    }
}
