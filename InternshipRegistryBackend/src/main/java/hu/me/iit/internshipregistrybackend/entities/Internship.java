package hu.me.iit.internshipregistrybackend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "internships")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Internship {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "start_date", nullable = false)
  private LocalDate startDate;

  @Column(name = "end_date")
  private LocalDate endDate;

  @Column(nullable = false)
  private int weeks;

  @Column(name = "company_instructor")
  private String companyInstructor;

  @Column
  public int grade;

  @Column(name = "certificate_date")
  private LocalDate certificateDate;

  @Column(nullable = false)
  private boolean completed;

  @OneToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "student_id", referencedColumnName = "user_id",
          nullable = false, unique = true)
  private Student student;

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "company_id", referencedColumnName = "id", nullable = false)
  private Company company;

  @Builder.Default
  @OneToMany(mappedBy = "internship", cascade = CascadeType.REMOVE,
          orphanRemoval = true, fetch = FetchType.LAZY)
  private List<Document> documents = new ArrayList<>();

}