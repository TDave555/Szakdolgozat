package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.create.CreateStudentDto;
import hu.me.iit.internshipregistrybackend.dtos.read.StudentDto;
import hu.me.iit.internshipregistrybackend.entities.Student;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.StudentMapper;
import hu.me.iit.internshipregistrybackend.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final PasswordEncoder passwordEncoder;

    public List<StudentDto> getAllStudents() {
        return studentMapper.toDtoList(studentRepository.findAll());
    }

    public StudentDto getStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new AppException("Student not found", HttpStatus.NOT_FOUND));
        return studentMapper.toDto(student);
    }

    public StudentDto getByNeptuncode(String neptuncode) {
        Student student = studentRepository.findByNeptuncode(neptuncode)
                .orElseThrow(() -> new AppException("Student with neptuncode: '" + neptuncode + "' not found",
                        HttpStatus.NOT_FOUND));
        return studentMapper.toDto(student);
    }

    public StudentDto createStudent(CreateStudentDto studentDto) {
        Student createStudent = Student.builder()
                .username(studentDto.getUsername())
                .password(passwordEncoder.encode(studentDto.getPassword()))
                //role is automatically set to STUDENT
                .name(studentDto.getName())
                .neptuncode(studentDto.getNeptuncode())
                .specialization(studentDto.getSpecialization())
                .build();

        return studentMapper.toDto(studentRepository.save(createStudent));
    }

    public StudentDto updateStudent(Long id, CreateStudentDto studentDto) {
        Student updateStudent = studentRepository.findById(id)
                .orElseThrow(() -> new AppException("Student not found", HttpStatus.NOT_FOUND));
        updateStudent.setUsername(studentDto.getUsername());
        updateStudent.setPassword(passwordEncoder.encode(studentDto.getPassword()));
        updateStudent.setName(studentDto.getName());
        updateStudent.setSpecialization(studentDto.getSpecialization());
        updateStudent.setNeptuncode(studentDto.getNeptuncode());

        return studentMapper.toDto(studentRepository.save(updateStudent));
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}