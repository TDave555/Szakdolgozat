package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateUpdateInternshipDto;
import hu.me.iit.internshipregistrybackend.dtos.read.InternshipDto;
import hu.me.iit.internshipregistrybackend.entities.Internship;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.InternshipMapper;
import hu.me.iit.internshipregistrybackend.repositories.CompanyRepository;
import hu.me.iit.internshipregistrybackend.repositories.InternshipRepository;
import hu.me.iit.internshipregistrybackend.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InternshipService {
    private final InternshipRepository internshipRepository;
    private final InternshipMapper internshipMapper;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    public List<InternshipDto> getAllInternships() {
        return internshipMapper.toDtoList(internshipRepository.findAll());
    }

    public List<InternshipDto> getAllInternshipsByCompletion(boolean completed) {
        return internshipMapper.toDtoList(internshipRepository.findAllByCompleted(completed));
    }

    public List<InternshipDto> getAllInternshipsByYearAndCompletion(int year, boolean completed) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);
        return internshipMapper.toDtoList(internshipRepository.findAllByStartDateRangeAndCompleted(start, end, completed));
    }

    public List<InternshipDto> getAllInternshipsByYear(int year) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);
        return internshipMapper.toDtoList(internshipRepository.findAllByStartDateRange(start, end));
    }

    public InternshipDto getInternship(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));
        return internshipMapper.toDto(internship);
    }

    public InternshipDto createInternship(CreateUpdateInternshipDto internshipDto) {
        Internship createInternship = Internship.builder()
                .startDate(internshipDto.getStartDate())
                .endDate(internshipDto.getEndDate())
                .weeks(internshipDto.getWeeks())
                .companyInstructor(internshipDto.getCompanyInstructor())
                .grade(internshipDto.getGrade())
                .certificateDate(internshipDto.getCertificateDate())
                .completed(internshipDto.isCompleted())
                .student(studentRepository.findById(internshipDto.getStudentId())
                        .orElseThrow(() -> new AppException("Student not found", HttpStatus.NOT_FOUND)))
                .company(companyRepository.findById(internshipDto.getCompanyId())
                        .orElseThrow(() -> new AppException("Company not found", HttpStatus.NOT_FOUND)))
                .build();
        return internshipMapper.toDto(internshipRepository.save(createInternship));
    }

    public InternshipDto updateInternship(Long id, CreateUpdateInternshipDto internshipDto) {
        Internship updateInternship = internshipRepository.findById(id)
                        .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));
        updateInternship.setStartDate(internshipDto.getStartDate());
        updateInternship.setEndDate(internshipDto.getEndDate());
        updateInternship.setWeeks(internshipDto.getWeeks());
        updateInternship.setCompanyInstructor(internshipDto.getCompanyInstructor());
        updateInternship.setGrade(internshipDto.getGrade());
        updateInternship.setCertificateDate(internshipDto.getCertificateDate());
        updateInternship.setCompleted(internshipDto.isCompleted());
        //Cannot change the Student the internship belongs to
        updateInternship.setCompany(companyRepository.findById(internshipDto.getCompanyId())
                .orElseThrow(() -> new AppException("Company not found", HttpStatus.NOT_FOUND)));
        return internshipMapper.toDto(internshipRepository.save(updateInternship));
    }

    public InternshipDto updateInternshipByStudent(Long id, CreateUpdateInternshipDto internshipDto) {
        Internship updateInternship = internshipRepository.findById(id)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));
        //student cannot change student id, grade, certificate and completion
        updateInternship.setStartDate(internshipDto.getStartDate());
        updateInternship.setEndDate(internshipDto.getEndDate());
        updateInternship.setWeeks(internshipDto.getWeeks());
        updateInternship.setCompanyInstructor(internshipDto.getCompanyInstructor());
        updateInternship.setCompany(companyRepository.findById(internshipDto.getCompanyId())
                .orElseThrow(() -> new AppException("Company not found", HttpStatus.NOT_FOUND)));
        return internshipMapper.toDto(internshipRepository.save(updateInternship));
    }

    public InternshipDto createInternshipByStudent(Long studentId, CreateUpdateInternshipDto internshipDto) {
        //student cannot set grade, certificate and completion
        Internship createInternship = Internship.builder()
                .startDate(internshipDto.getStartDate())
                .endDate(internshipDto.getEndDate())
                .weeks(internshipDto.getWeeks())
                .companyInstructor(internshipDto.getCompanyInstructor())
                .completed(false)
                .student(studentRepository.findById(studentId)
                        .orElseThrow(() -> new AppException("Student not found", HttpStatus.NOT_FOUND)))
                .company(companyRepository.findById(internshipDto.getCompanyId())
                        .orElseThrow(() -> new AppException("Company not found", HttpStatus.NOT_FOUND)))
                .build();
        return internshipMapper.toDto(internshipRepository.save(createInternship));

    }

    public void deleteInternship(Long id) {
        internshipRepository.deleteById(id);
    }
}
