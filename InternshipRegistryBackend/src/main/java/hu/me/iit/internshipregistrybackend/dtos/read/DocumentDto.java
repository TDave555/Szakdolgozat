package hu.me.iit.internshipregistrybackend.dtos.read;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentDto {

    @NotNull
    private Long id;

    @NotBlank
    @Size(min = 3)
    private String title;

    @NotBlank
    private String fileExtension;

    @NotBlank
    private String filepath;

    @NotNull
    private Long internshipId;
}
