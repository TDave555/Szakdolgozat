package hu.me.iit.internshipregistrybackend.controllers;

import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateUpdateInternshipDto;
import hu.me.iit.internshipregistrybackend.dtos.read.DocumentDto;
import hu.me.iit.internshipregistrybackend.dtos.read.InternshipDto;
import hu.me.iit.internshipregistrybackend.dtos.read.StudentDto;
import hu.me.iit.internshipregistrybackend.services.DocumentService;
import hu.me.iit.internshipregistrybackend.services.InternshipService;
import hu.me.iit.internshipregistrybackend.services.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/student/me")
@RequiredArgsConstructor
public class StudentSelfController {
    private final StudentService studentService;
    private final InternshipService internshipService;
    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<StudentDto> getOwnStudentDetails(Principal principal) {
        return ResponseEntity.ok(studentService.getByUsername(principal.getName()));
    }

    @GetMapping("/internship")
    public ResponseEntity<InternshipDto> getOwnInternshipDetails(Principal principal) {
        return ResponseEntity.ok(internshipService.getInternship(studentService
                .getByUsername(principal.getName()).getInternshipId()
        ));
    }

    @PostMapping("/internship")
    public ResponseEntity<InternshipDto> createInternship(@Valid @RequestBody CreateUpdateInternshipDto internshipDto, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(internshipService
                .createInternshipByStudent(studentService.getByUsername(principal.getName()).getId(), internshipDto));
    }

    @PutMapping("/internship")
    public ResponseEntity<InternshipDto> updateInternshipDetails(@Valid @RequestBody CreateUpdateInternshipDto internshipDto, Principal principal) {
        return ResponseEntity.ok(internshipService.updateInternshipByStudent(studentService.getByUsername(principal.getName())
                .getInternshipId(), internshipDto));
    }

    @GetMapping("/internship/documents")
    public ResponseEntity<List<DocumentDto>> getAllDocumentsByStudent(Principal principal) {
        return ResponseEntity.ok(documentService.getAllDocumentsByInternshipId(studentService
                .getByUsername(principal.getName()).getInternshipId()));
    }

    @GetMapping("/internship/documents/{documentId}/download")
    public ResponseEntity<Resource> sendDocumentToStudent(@PathVariable Long documentId, Principal principal) {
        Resource resource = documentService.sendFileToStudent(documentId, principal.getName());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping
    public ResponseEntity<DocumentDto> createDocument(@RequestParam("file") MultipartFile file, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.createDocument(
                file, studentService.getByUsername(principal.getName()).getInternshipId()));
    }

    @DeleteMapping("/internship/documents/{documentId}")
    public ResponseEntity<Void> deleteDocumentByIdByUser(@PathVariable Long documentId, Principal principal) {
        documentService.deleteDocumentByUser(documentId, principal.getName());
        return ResponseEntity.noContent().build();
    }

}
