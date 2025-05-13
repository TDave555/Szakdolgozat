package hu.me.iit.internshipregistrybackend.dtos.update;

import hu.me.iit.internshipregistrybackend.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserDto {

    @NotBlank
    @Size(max = 25)
    private String username;

    @NotNull
    private Role role;
}
