package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.dtos.read.StudentDto;
import hu.me.iit.internshipregistrybackend.entities.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StudentMapper {

    @Mapping(source = "internship.id", target = "internshipId")
    StudentDto toDto(Student student);

    List<StudentDto> toDtoList(List<Student> users);
}
