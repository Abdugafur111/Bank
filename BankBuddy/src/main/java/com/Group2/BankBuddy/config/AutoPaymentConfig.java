package com.Group2.BankBuddy.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "bill-automation")
public class AutoPaymentConfig {
    private long interval = 86400000; // Default interval is 1 day

    public long getInterval() {
        return interval;
    }

    public void setInterval(long interval) {
        this.interval = interval;
    }
}
