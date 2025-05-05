package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.StudentDto;
import hu.me.iit.internshipregistrybackend.entities.Student;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.StudentMapper;
import hu.me.iit.internshipregistrybackend.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    public List<StudentDto> getAllStudents() {
        return studentMapper.toDtoList(studentRepository.findAll());
    }

    public StudentDto getStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new AppException("Student not found", HttpStatus.NOT_FOUND));
        return studentMapper.toDto(student);
    }

    public StudentDto createStudent(StudentDto studentDto) {
        Student student = studentMapper.toEntity(studentDto);
        return studentMapper.toDto(studentRepository.save(student));
    }

    public StudentDto updateStudent(Long id, Student updatedStudent) {
        Student originalStudent = studentRepository.findById(id)
                .orElseThrow(() -> new AppException("Student not found", HttpStatus.NOT_FOUND));
        updatedStudent.setId(originalStudent.getId());
        return studentMapper.toDto(studentRepository.save(updatedStudent));
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}