package hu.me.iit.internshipregistrybackend.dtos.read;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyDto {

    @NotNull
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    @NotNull
    private boolean active;
}
