package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateStudentDto;
import hu.me.iit.internshipregistrybackend.dtos.create_update.UpdateStudentDto;
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

    public StudentDto getByUsername(String username) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("Student with username: '" + username + "' not found",
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

    public StudentDto updateStudent(Long id, UpdateStudentDto studentDto) {
        Student updateStudent = studentRepository.findById(id)
                .orElseThrow(() -> new AppException("Student not found", HttpStatus.NOT_FOUND));
        //all user-related fields managed by userservice
        updateStudent.setName(studentDto.getName());
        updateStudent.setSpecialization(studentDto.getSpecialization());
        if (!updateStudent.getNeptuncode().equals(studentDto.getNeptuncode())) {
            if (studentRepository.existsByNeptuncode(studentDto.getNeptuncode()))
                throw new AppException("Neptuncode already exists", HttpStatus.BAD_REQUEST);
            updateStudent.setNeptuncode(studentDto.getNeptuncode());
        }

        return studentMapper.toDto(studentRepository.save(updateStudent));
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}