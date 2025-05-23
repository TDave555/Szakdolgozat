package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.dtos.read.InternshipDto;
import hu.me.iit.internshipregistrybackend.entities.Internship;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring",
        uses = { StudentMapper.class, CompanyMapper.class })
public interface InternshipMapper {

    InternshipDto toDto(Internship internship);

    List<InternshipDto> toDtoList(List<Internship> internships);

}
