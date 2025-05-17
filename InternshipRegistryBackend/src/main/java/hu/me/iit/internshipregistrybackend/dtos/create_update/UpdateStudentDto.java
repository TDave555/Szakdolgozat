package hu.me.iit.internshipregistrybackend.dtos.create_update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStudentDto {

    @NotBlank
    private String name;

    @NotBlank
    @Pattern(regexp = "^[A-Z0-9]{6}$", message = "Neptuncode must be exactly 6 uppercase letters or digits")
    private String neptuncode;

    @NotBlank
    private String specialization;
}
