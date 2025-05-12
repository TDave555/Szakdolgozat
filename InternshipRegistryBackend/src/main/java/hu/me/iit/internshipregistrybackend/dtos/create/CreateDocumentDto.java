package hu.me.iit.internshipregistrybackend.dtos.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateDocumentDto {

    @NotBlank
    @Size(min = 3)
    private String title;

    @NotBlank
    private String fileExtension;

    @NotBlank
    private String filePath;

    @NotNull
    private Long internshipId;
}
