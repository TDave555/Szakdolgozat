package hu.me.iit.internshipregistrybackend.repositories;

import hu.me.iit.internshipregistrybackend.entities.Document;
import hu.me.iit.internshipregistrybackend.entities.Internship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    Optional<Document> findByInternship(Internship internship);

}
