package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.dtos.DocumentDto;
import hu.me.iit.internshipregistrybackend.entities.Document;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DocumentMapper {
    Document toEntity(DocumentDto documentDto);
    DocumentDto toDto(Document document);
    List<DocumentDto> toDtoList(List<Document> documents);
}
