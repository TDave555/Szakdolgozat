package hu.me.iit.internshipregistrybackend.dtos.create_update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserPasswordDto {
    @NotBlank
    @Size(min = 6, max = 25)
    private String password;
}
