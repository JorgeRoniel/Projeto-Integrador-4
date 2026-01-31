package com.ufc.APIlibrary;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableScheduling
public class ApIlibraryApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApIlibraryApplication.class, args);
	}

	@PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
    }

}
