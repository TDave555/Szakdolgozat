package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.dtos.read.DocumentDto;
import hu.me.iit.internshipregistrybackend.entities.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    @Mapping(source = "internship.id", target = "internshipId")
    DocumentDto toDto(Document document);

    List<DocumentDto> toDtoList(List<Document> documents);
}

