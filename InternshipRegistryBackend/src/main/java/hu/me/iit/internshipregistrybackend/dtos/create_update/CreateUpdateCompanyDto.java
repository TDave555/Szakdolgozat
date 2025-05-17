package hu.me.iit.internshipregistrybackend.dtos.create_update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateUpdateCompanyDto {

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    @NotNull
    private boolean active;
}
