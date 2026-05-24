package com.dibyajit.terragraphbackend;

import com.dibyajit.terragraphbackend.model.User;
import com.dibyajit.terragraphbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TerragraphBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TerragraphBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setId("default-user-id");
                user.setEmail("admin@terragraph.com");
                user.setUsername("admin");
                userRepository.save(user);
            }
        };
    }
}
