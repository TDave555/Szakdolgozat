package hu.me.iit.internshipregistrybackend.config;

import hu.me.iit.internshipregistrybackend.entities.User;
import hu.me.iit.internshipregistrybackend.enums.Role;
import hu.me.iit.internshipregistrybackend.repositories.UserRepository;
import hu.me.iit.internshipregistrybackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (!userService.existsByUsername("admin")) {
            User adminUser = new User().builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(adminUser);
            System.out.println("Default admin user created.");
        }
    }

}
