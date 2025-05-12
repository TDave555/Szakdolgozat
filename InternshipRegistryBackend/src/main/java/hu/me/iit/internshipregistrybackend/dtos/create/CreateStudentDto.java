package hu.me.iit.internshipregistrybackend.dtos.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateStudentDto {

    @NotBlank
    @Size( max = 25)
    private String username;

    @NotBlank
    @Size(min = 6, max = 25)
    private String password;

    @NotBlank
    private String name;

    @NotBlank
    @Pattern(regexp = "^[A-Z0-9]{6}$", message = "Neptuncode must be exactly 6 uppercase letters or digits")
    private String neptuncode;

    @NotBlank
    private String specialization;
}
