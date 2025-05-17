package hu.me.iit.internshipregistrybackend.dtos.create_update;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateUpdateInternshipDto {

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @Min(6)
    @Max(8)
    private int weeks;

    private String companyInstructor;

    @Min(1)
    @Max(5)
    private int grade;

    private LocalDate certificateDate;

    @NotNull
    private boolean completed;

    @NotNull
    private Long studentId;

    @NotNull
    private Long companyId;
}
