package hu.me.iit.internshipregistrybackend.services;

import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateUpdateCompanyDto;
import hu.me.iit.internshipregistrybackend.dtos.read.CompanyDto;
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

    public CompanyDto getCompanyByName(String name) {
        Company company = companyRepository.findByName(name)
                .orElseThrow(() -> new AppException("Company with name: '" + name + "' not found", HttpStatus.NOT_FOUND));
        return companyMapper.toDto(company);
    }

    public CompanyDto createCompany(CreateUpdateCompanyDto companyDto) {
        Company createCompany = Company.builder()
                .name(companyDto.getName())
                .address(companyDto.getAddress())
                .active(true)
                .build();

        return companyMapper.toDto(companyRepository.save(createCompany));
    }

    public CompanyDto updateCompany(Long id, CreateUpdateCompanyDto companyDto) {
        Company updateCompany = companyRepository.findById(id)
                        .orElseThrow(() -> new AppException("Company not found", HttpStatus.NOT_FOUND));
        updateCompany.setName(companyDto.getName());
        updateCompany.setAddress(companyDto.getAddress());
        updateCompany.setActive(companyDto.isActive());

        return companyMapper.toDto(companyRepository.save(updateCompany));
    }

    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }
}
