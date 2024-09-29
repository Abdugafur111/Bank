package com.Group2.BankBuddy.controller;

import com.Group2.BankBuddy.exceptions.ZeroAmountException;
import com.Group2.BankBuddy.services.AccountService;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/bank")
public class ATMController {
    private final AccountService accountService;


    @Autowired
    public ATMController(AccountService accountService) {
        this.accountService = accountService;
    }

    private double extractAmount(String fullText) {
        // Define a regular expression pattern to match the desired number
        String regex2 = "\\b(\\d+\\.\\d{2})\\b";        Pattern pattern2 = Pattern.compile(regex2);
        Matcher matcher2 = pattern2.matcher(fullText);

        int count = 0;
        double amount = 0;
        String extractedNumber = null;
        while (matcher2.find() && count < 2) {
            extractedNumber = matcher2.group();
            count++;
        }
        if (extractedNumber!=null) {
            amount = Double.parseDouble(extractedNumber);
        }
        return amount;
    }

    @PostMapping("/processImage")
    public String processImage(@RequestParam("file") MultipartFile file,
                               @RequestParam("userId") int userId,
                               @RequestParam("destinationAccount") int destinationAccount) {
        try {
            // Check if a file was provided
            if (file != null) {

                //For DOCKER RUN
                byte[] fileContent = file.getBytes();
                ByteArrayInputStream inputStream = new ByteArrayInputStream(fileContent);
                BufferedImage bufferedImage = ImageIO.read(inputStream);
                Tesseract tesseract = new Tesseract();
                tesseract.setLanguage("eng");
                String fullText = tesseract.doOCR(bufferedImage);

                //For LOCAL RUN
//                String inputFilePath = "/Users/abdugafur/Downloads/omg.png";
//                System.setProperty("jna.library.path", "/usr/local/lib");
//                Tesseract tesseract = new Tesseract();
//                tesseract.setDatapath("/Users/abdugafur/Downloads/OCRR");
//                tesseract.setLanguage("eng");
//                String fullText = tesseract.doOCR(new File(inputFilePath));

                double amount = extractAmount(fullText);
                String response = amount + "$ sent to account " + destinationAccount + " with user Id of " + userId;
                BigDecimal amountDecimal = new BigDecimal(amount);

                try{
                if (amountDecimal.compareTo(BigDecimal.ZERO) == 0) {
                    throw new ZeroAmountException("Amount cannot be zero.");
                }}catch (ZeroAmountException ze){
                    return "Amount cannot be zero";

                }

                accountService.deposit(userId,destinationAccount,amountDecimal);

                return response;
            } else {
                return "No file provided for processing.";
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            return "Error processing the image";
        }

    }
}

