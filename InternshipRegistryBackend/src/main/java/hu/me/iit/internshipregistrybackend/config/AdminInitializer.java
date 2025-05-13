package hu.me.iit.internshipregistrybackend.config;

import hu.me.iit.internshipregistrybackend.entities.User;
import hu.me.iit.internshipregistrybackend.enums.Role;
import hu.me.iit.internshipregistrybackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(adminUser);
            System.out.println("Default admin user created.");
        }
    }

}
