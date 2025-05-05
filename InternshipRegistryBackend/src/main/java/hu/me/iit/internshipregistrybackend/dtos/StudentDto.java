package hu.me.iit.internshipregistrybackend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.SuperBuilder;


@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class StudentDto extends UserDto {

    @NotBlank
    private String name;

    @NotBlank
    @Size(min=6, max = 6)
    private String neptuncode;

    @NotBlank
    private String specialization;

    private Long internshipId;
}
