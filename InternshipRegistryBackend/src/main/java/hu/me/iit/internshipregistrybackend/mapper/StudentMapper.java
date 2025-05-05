package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.dtos.StudentDto;
import hu.me.iit.internshipregistrybackend.entities.Internship;
import hu.me.iit.internshipregistrybackend.entities.Student;
import hu.me.iit.internshipregistrybackend.repositories.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    @Mapping(source = "internshipId", target = "internship.id")
    @Mapping(target = "password", ignore = true)
    Student toEntity(StudentDto studentDto);

    @Mapping(source = "internship.id", target = "internshipId")
    StudentDto toDto(Student student);

    List<StudentDto> toDtoList(List<Student> users);
}

@Component
@RequiredArgsConstructor
class InternshipFetcher {
    private final InternshipRepository internshipRepository;

    @ObjectFactory
    public Internship resolve(StudentDto studentDto) {
        if (studentDto != null && studentDto.getInternshipId() != null) {
            return internshipRepository.findById(studentDto.getInternshipId()).orElse(null);
        }
        return null;
    }
}
