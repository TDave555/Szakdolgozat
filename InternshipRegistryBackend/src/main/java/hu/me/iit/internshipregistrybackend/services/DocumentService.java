package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.read.DocumentDto;
import hu.me.iit.internshipregistrybackend.entities.Document;
import hu.me.iit.internshipregistrybackend.entities.Internship;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.DocumentMapper;
import hu.me.iit.internshipregistrybackend.repositories.DocumentRepository;
import hu.me.iit.internshipregistrybackend.repositories.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;
    private final InternshipRepository internshipRepository;
    private final List<String> allowedFileTypes = List.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    private final Tika tika = new Tika();
    private final Path rootDirectory = Paths.get("InternshipDocuments");

    public List<DocumentDto> getAllDocumentsByInternshipId(Long internshipId) {
        List<Document> documents = documentRepository.findAllByInternshipId(internshipId);
        return documentMapper.toDtoList(documents);
    }

    public DocumentDto getDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
        return documentMapper.toDto(document);
    }

    public DocumentDto createDocument(MultipartFile file, Long internshipId) {
        if(file.isEmpty() || file.getOriginalFilename() == null ||
                file.getOriginalFilename().isBlank())
            throw new AppException("Invalid file or filename", HttpStatus.BAD_REQUEST);

        //target directory: 'InternshipDocuments/{internshipYear}/{studentNeptuncode}/'
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));

        Integer internshipYear = (internship.getStartDate() != null) ?
                Integer.valueOf(internship.getStartDate().getYear()) :
                Integer.valueOf(LocalDateTime.now().getYear());
        String studentNeptuncode = internship.getStudent().getNeptuncode();

        String filepath;
        String title;
        String filetype;
        String fileExtension;

        try {
            Path targetDirectory = rootDirectory.resolve(internshipYear.toString()).
                    resolve(studentNeptuncode).normalize();
            Files.createDirectories(targetDirectory);

            filetype = tika.detect(file.getInputStream());

            //creating sanitized filename
            String filename = Path.of(file.getOriginalFilename()).getFileName().toString();
            //ensuring unique filename
            title = filename.substring(0, filename.lastIndexOf('.'));
            fileExtension = filename.substring(filename.lastIndexOf('.') + 1);
            filename = title + LocalDateTime.now().format(DateTimeFormatter
                    .ofPattern("yyyy-MM-dd_HH-mm-ss")) + "." +
                    fileExtension;

            Path destFilepath = targetDirectory.resolve(filename);
            filepath = destFilepath.toString();
            file.transferTo(destFilepath);
        } catch (IOException e) {
            throw new AppException("File upload failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!allowedFileTypes.contains(filetype))
            throw new AppException("File type not allowed", HttpStatus.BAD_REQUEST);

        Document createDocument = Document.builder()
                .title(title)
                .fileExtension(fileExtension)
                .filepath(filepath)
                .internship(internship)
                .build();
        return documentMapper.toDto(documentRepository.save(createDocument));
    }

    public Resource sendFile(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
        Resource resource;
        try {
            Path filePath = Path.of(document.getFilepath());
            resource = new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            throw new AppException("File could not be provided", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (resource.exists() && resource.isReadable())
            return resource;
        else
            throw new AppException("Could not read file: "
                    + document.getTitle() + "." + document.getFileExtension(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public Resource sendFileToStudent(Long id, String username) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
        if (!document.getInternship().getStudent().getUsername().equals(username))
            throw new AppException("User is not authorized to view this file", HttpStatus.FORBIDDEN);
        return sendFile(id);
    }

    //no update method, just delete and reupload

    public void deleteDocument(Long id) {
        try {
            Document document = documentRepository.findById(id)
                    .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
            Path filePath = Path.of(document.getFilepath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            //no exception
            //no file to delete, so the record should not exist
        }
        documentRepository.deleteById(id);
    }

    public void deleteDocumentByUser(Long id, String username) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new AppException("Document not found", HttpStatus.NOT_FOUND));
        if (!document.getInternship().getStudent().getUsername().equals(username))
            throw new AppException("User is not authorized to delete this file", HttpStatus.FORBIDDEN);
        deleteDocument(id);
    }

}
