package hu.me.iit.internshipregistrybackend.dtos.read;

import hu.me.iit.internshipregistrybackend.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserDto {

    @NotNull
    private Long id;

    @NotBlank
    @Size(max = 25)
    private String username;

    @NotNull
    private Role role;
}
