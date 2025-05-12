package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.create.CreateDocumentDto;
import hu.me.iit.internshipregistrybackend.dtos.read.DocumentDto;
import hu.me.iit.internshipregistrybackend.entities.Document;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.DocumentMapper;
import hu.me.iit.internshipregistrybackend.repositories.DocumentRepository;
import hu.me.iit.internshipregistrybackend.repositories.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;
    private final InternshipRepository internshipRepository;

    public List<DocumentDto> getAllDocuments() {
        return documentMapper.toDtoList(documentRepository.findAll());
    }

    public DocumentDto getDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
        return documentMapper.toDto(document);
    }

    public DocumentDto createDocument(CreateDocumentDto documentDto) {
        Document createDocument = Document.builder()
                .title(documentDto.getTitle())
                .fileExtension(documentDto.getFileExtension())
                .filePath(documentDto.getFilePath())
                .internship(internshipRepository.findById(documentDto.getInternshipId())
                        .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND)))
                .build();
        return documentMapper.toDto(documentRepository.save(createDocument));
    }

    public DocumentDto updateDocument(Long id, CreateDocumentDto documentDto) {
        Document updateDocument = documentRepository.findById(id)
                .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
        updateDocument.setTitle(documentDto.getTitle());
        updateDocument.setFileExtension(documentDto.getFileExtension());
        updateDocument.setFilePath(documentDto.getFilePath());
        //Cannot change the Internship the document belongs to
        return documentMapper.toDto(documentRepository.save(updateDocument));
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}
