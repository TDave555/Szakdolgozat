package hu.me.iit.internshipregistrybackend.repositories;

import hu.me.iit.internshipregistrybackend.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByNeptuncode(String neptuncode);
    boolean existsByNeptuncode(String neptuncode);

    Optional<Student> findByUsername(String username);
}
