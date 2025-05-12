package hu.me.iit.internshipregistrybackend.mapper;

import hu.me.iit.internshipregistrybackend.dtos.read.CompanyDto;
import hu.me.iit.internshipregistrybackend.entities.Company;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CompanyMapper {

    Company toEntity(CompanyDto companyDto);

    CompanyDto toDto(Company company);

    List<CompanyDto> toDtoList(List<Company> companies);

}
