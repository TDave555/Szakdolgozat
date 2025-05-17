package hu.me.iit.internshipregistrybackend.controllers;

import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateUpdateInternshipDto;
import hu.me.iit.internshipregistrybackend.dtos.read.InternshipDto;
import hu.me.iit.internshipregistrybackend.services.InternshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internships")
@RequiredArgsConstructor
public class InternshipController {

    private final InternshipService internshipService;

    @GetMapping
    public ResponseEntity<List<InternshipDto>> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping(params = "year")
    public ResponseEntity<List<InternshipDto>> getAllInternshipsByYear(@RequestParam int year) {
        return ResponseEntity.ok(internshipService.getAllInternshipsByYear(year));
    }

    @GetMapping(params = {"year", "completed"})
    public ResponseEntity<List<InternshipDto>> getAllInternshipsByYearAndCompletion(@RequestParam int year, @RequestParam boolean completed) {
        return ResponseEntity.ok(internshipService.getAllInternshipsByYearAndCompletion(year, completed));
    }

    @GetMapping(params = "completed")
    public ResponseEntity<List<InternshipDto>> getAllInternshipsByCompletion(@RequestParam boolean completed) {
        return ResponseEntity.ok(internshipService.getAllInternshipsByCompletion(completed));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipDto> getInternshipById(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getInternship(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InternshipDto> updateInternship(@PathVariable Long id, @Valid @RequestBody CreateUpdateInternshipDto internshipDto) {
        return ResponseEntity.ok(internshipService.updateInternship(id, internshipDto));
    }

    @PostMapping
    public ResponseEntity<InternshipDto> createInternship(@Valid @RequestBody CreateUpdateInternshipDto internshipDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(internshipService.createInternship(internshipDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInternshipById(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return ResponseEntity.noContent().build();
    }
}
