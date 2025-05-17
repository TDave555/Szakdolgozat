package hu.me.iit.internshipregistrybackend.controllers;

import hu.me.iit.internshipregistrybackend.dtos.read.DocumentDto;
import hu.me.iit.internshipregistrybackend.services.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/byinternship/{internshipId}")
    public ResponseEntity<List<DocumentDto>> getAllDocumentsByInternshipId(@PathVariable Long internshipId) {
        return ResponseEntity.ok(documentService.getAllDocumentsByInternshipId(internshipId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDto> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocument(id));
    }

    @PostMapping
    public ResponseEntity<DocumentDto> createDocument(@RequestParam("file") MultipartFile file, @RequestParam("internshipId") Long internshipId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.createDocument(file, internshipId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> sendDocument(@PathVariable Long id) {
        Resource resource = documentService.sendFile(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocumentById(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
