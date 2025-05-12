package hu.me.iit.internshipregistrybackend.dtos.create;

import hu.me.iit.internshipregistrybackend.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateUserDto {

    @NotBlank
    @Size(max = 25)
    private String username;

    @NotBlank
    @Size(min = 6, max = 25)
    private String password;

    @NotNull
    private Role role;
}
