package hu.me.iit.internshipregistrybackend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Builder
public class DocumentDto {

    @NotNull
    private Long id;

    @NotBlank
    @Size(min = 3)
    private String name;

    @NotBlank
    private String fileExtension;

    @NotBlank
    private String filePath;

    @NotNull
    private Long internshipId;
}
