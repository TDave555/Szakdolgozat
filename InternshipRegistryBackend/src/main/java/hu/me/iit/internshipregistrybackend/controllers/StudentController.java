package hu.me.iit.internshipregistrybackend.controllers;

import hu.me.iit.internshipregistrybackend.dtos.create_update.UpdateStudentDto;
import hu.me.iit.internshipregistrybackend.dtos.read.StudentDto;
import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateStudentDto;
import hu.me.iit.internshipregistrybackend.services.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@PreAuthorize("hasRole('COORDINATOR')")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<StudentDto> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudent(id));
    }

    @GetMapping("/{neptuncode}")
    public ResponseEntity<StudentDto> getStudentByNeptuncode(@PathVariable String neptuncode) {
        return ResponseEntity.ok(studentService.getByNeptuncode(neptuncode));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<StudentDto> getStudentByUsername(@PathVariable String username) {
        return ResponseEntity.ok(studentService.getByUsername(username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id, @Valid @RequestBody UpdateStudentDto studentDto) {
        StudentDto updatedStudent = studentService.updateStudent(id, studentDto);
        return ResponseEntity.ok(updatedStudent);
    }

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@Valid @RequestBody CreateStudentDto studentDto) {
        StudentDto createdStudent = studentService.createStudent(studentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentById(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
