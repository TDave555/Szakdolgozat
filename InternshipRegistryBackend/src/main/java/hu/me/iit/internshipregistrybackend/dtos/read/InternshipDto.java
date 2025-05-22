package hu.me.iit.internshipregistrybackend.dtos.read;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternshipDto {

    @NotNull
    private Long id;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull
    @Min(6)
    @Max(8)
    private int weeks;

    private String companyInstructor;

    @Max(5)
    private int grade;

    private LocalDate certificateDate;

    @NotNull
    private boolean completed;

    @NotNull
    private StudentDto student;

    @NotNull
    private CompanyDto company;
}
