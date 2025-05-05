package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.CompanyDto;
import hu.me.iit.internshipregistrybackend.entities.Company;
import hu.me.iit.internshipregistrybackend.exceptions.AppException;
import hu.me.iit.internshipregistrybackend.mapper.CompanyMapper;
import hu.me.iit.internshipregistrybackend.repositories.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    public List<CompanyDto> getAllCompanies() {
        return companyMapper.toDtoList(companyRepository.findAll());
    }

    public CompanyDto getCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new AppException("Company not found", HttpStatus.NOT_FOUND));
        return companyMapper.toDto(company);
    }

    public CompanyDto createCompany(Company company) {
        return companyMapper.toDto(companyRepository.save(company));
    }

    public hu.me.iit.internshipregistrybackend.dtos.CompanyDto updateCompany(Long id, Company updatedCompany) {
        Company originalCompany = companyRepository.findById(id)
                        .orElseThrow(() -> new AppException("Company not found", HttpStatus.NOT_FOUND));
        updatedCompany.setId(originalCompany.getId());
        return companyMapper.toDto(companyRepository.save(updatedCompany));
    }

    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }
}
