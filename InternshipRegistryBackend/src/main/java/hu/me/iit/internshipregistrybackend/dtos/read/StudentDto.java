package hu.me.iit.internshipregistrybackend.dtos.read;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class StudentDto extends UserDto {

    @NotBlank
    private String name;

    @NotBlank
    @Pattern(regexp = "^[A-Z0-9]{6}$", message = "Neptuncode must be exactly 6 uppercase letters or digits")
    private String neptuncode;

    @NotBlank
    private String specialization;

    private Long internshipId;
}
