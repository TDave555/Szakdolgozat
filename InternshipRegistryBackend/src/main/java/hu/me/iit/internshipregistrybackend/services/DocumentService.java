package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.DocumentDto;
import hu.me.iit.internshipregistrybackend.entities.Document;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.DocumentMapper;
import hu.me.iit.internshipregistrybackend.repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    public List<DocumentDto> getAllDocuments() {
        return documentMapper.toDtoList(documentRepository.findAll());
    }

    public DocumentDto getDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
        return documentMapper.toDto(document);
    }

    public DocumentDto createDocument(Document document) {
        return documentMapper.toDto(documentRepository.save(document));
    }

    public DocumentDto updateDocument(Long id, Document updatedDocument) {
        Document originalDocument = documentRepository.findById(id)
                        .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
        updatedDocument.setId(originalDocument.getId());
        return documentMapper.toDto(documentRepository.save(updatedDocument));
    }

    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}
