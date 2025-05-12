package hu.me.iit.internshipregistrybackend.dtos.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateCompanyDto {

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    @NotNull
    private boolean active;
}
