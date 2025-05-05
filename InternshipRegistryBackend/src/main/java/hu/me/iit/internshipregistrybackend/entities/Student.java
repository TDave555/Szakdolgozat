package hu.me.iit.internshipregistrybackend.entities;

import hu.me.iit.internshipregistrybackend.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "students")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "user_id", referencedColumnName = "id")
public class Student extends User {

  @Column(nullable = false)
  private String name;

  @Column(unique = true, nullable = false, length = 6)
  private String neptuncode;

  @Column(nullable = false)
  private String specialization;

  @OneToOne(mappedBy = "student", cascade = CascadeType.REMOVE, orphanRemoval = true)
  private Internship internship;

  @PrePersist
  @PreUpdate
  public void studentRolePrePersist() {
    setRole(Role.STUDENT);
  }

}