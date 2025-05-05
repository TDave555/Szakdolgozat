package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.dtos.InternshipDto;
import hu.me.iit.internshipregistrybackend.entities.Internship;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = { UserMapper.class, CompanyMapper.class, DocumentMapper.class })
public interface InternshipMapper {
    Internship toEntity(InternshipDto internshipDto);
    InternshipDto toDto(Internship internship);
    List<InternshipDto> toDtoList(List<Internship> internships);
}
