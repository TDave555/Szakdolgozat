package hu.me.iit.internshipregistrybackend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Document {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(name = "file_extension", nullable = false)
  private String fileExtension;

  @Column(nullable = false)
  private String filepath;

  @ManyToOne(optional = false)
  @JoinColumn(name = "internship_id", referencedColumnName = "id", nullable = false)
  private  Internship internship;

}