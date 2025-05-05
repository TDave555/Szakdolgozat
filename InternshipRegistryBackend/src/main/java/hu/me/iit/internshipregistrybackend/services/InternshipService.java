package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.InternshipDto;
import hu.me.iit.internshipregistrybackend.entities.Internship;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.InternshipMapper;
import hu.me.iit.internshipregistrybackend.repositories.InternshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InternshipService {
    private final InternshipRepository internshipRepository;
    private final InternshipMapper internshipMapper;

    public List<InternshipDto> getAllInternships() {
        return internshipMapper.toDtoList(internshipRepository.findAll());
    }

    public InternshipDto getInternship(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));
        return internshipMapper.toDto(internship);
    }

    public InternshipDto createInternship(Internship internship) {
        return internshipMapper.toDto(internshipRepository.save(internship));
    }

    public InternshipDto updateInternship(Long id, Internship updatedInternship) {
        Internship originalInternship = internshipRepository.findById(id)
                        .orElseThrow(() -> new AppException("Internship not found", HttpStatus.NOT_FOUND));
        updatedInternship.setId(originalInternship.getId());
        return internshipMapper.toDto(internshipRepository.save(updatedInternship));
    }

    public void deleteInternship(Long id) {
        internshipRepository.deleteById(id);
    }
}
