package hu.me.iit.internshipregistrybackend.repositories;

import hu.me.iit.internshipregistrybackend.entities.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface InternshipRepository extends JpaRepository<Internship, Long> {

    List<Internship> findAllByCompleted(boolean completed);

    @Query("SELECT i FROM Internship i " +
            "WHERE i.startDate BETWEEN :firstDate AND :secondDate")
    List<Internship> findAllByStartDateRange(@Param("firstDate") LocalDate firstDate,
                                          @Param("secondDate") LocalDate secondDate);

    @Query("SELECT i FROM Internship i " +
            "WHERE i.startDate BETWEEN :firstDate AND :secondDate AND i.completed = :completed")
    List<Internship> findAllByStartDateRangeAndCompleted(@Param("firstDate") LocalDate firstDate,
                                                         @Param("secondDate") LocalDate secondDate,
                                                         @Param("completed") boolean completed);


}
