package hu.me.iit.internshipregistrybackend.controllers;

import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateUpdateCompanyDto;
import hu.me.iit.internshipregistrybackend.dtos.read.CompanyDto;
import hu.me.iit.internshipregistrybackend.services.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/companies")
@PreAuthorize("hasRole('COORDINATOR')")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto> getCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompany(id));
    }

    @GetMapping("/name/{companyName}")
    public ResponseEntity<CompanyDto> getCompanyByName(@PathVariable String companyName) {
        return ResponseEntity.ok(companyService.getCompanyByName(companyName));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable Long id, @Valid @RequestBody CreateUpdateCompanyDto companyDto) {
        return ResponseEntity.ok(companyService.updateCompany(id, companyDto));
    }

    @PostMapping
    public ResponseEntity<CompanyDto> createCompany(@Valid @RequestBody CreateUpdateCompanyDto companyDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.createCompany(companyDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompanyById(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}
