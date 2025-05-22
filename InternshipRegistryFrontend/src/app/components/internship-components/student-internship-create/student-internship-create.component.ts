import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipService } from '../../../services/internship.service';
import { StudentDto } from '../../../models/student-dto.model';
import { CompanyDto } from '../../../models/company-dto.model';
import { Subject, takeUntil } from 'rxjs';
import { StudentSelfService } from '../../../services/student-self.service';
import { CompanyService } from '../../../services/company.service';
import { CreateUpdateInternshipDto } from '../../../models/internship-create-update-dto.model';

@Component({
  selector: 'app-student-internship-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-internship-create.component.html',
  styleUrl: './student-internship-create.component.css'
})
export class StudentInternshipCreateComponent implements OnInit, OnDestroy {
  internshipForm: FormGroup;
  student: StudentDto | null = null;
  companies: CompanyDto[] = [];
  message: string | null = null;
  error: string | null = null;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentSelfService: StudentSelfService,
    private companyService: CompanyService
  ) {
    this.internshipForm = this.fb.group({
      student: [null],
      companyId: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      weeks: [null, Validators.required],
      companyInstructor: [null]
    });
  }

  ngOnInit(): void {
      this.loadStudentUser();
      this.loadCompanies();
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudentUser() : void {
    this.studentSelfService.getOwnStudentDetails()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (student: StudentDto) => {
        this.student = student;
        this.internshipForm.patchValue ({
          student: this.student.name + " (" +
            this.student.neptuncode + ")"
        });
      },
      error: (err) => {
        this.error = "Failed to get User: "
      },
    });
  }

  loadCompanies(): void {
    this.companyService
      .getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (companies: CompanyDto[]) => {
          this.companies = companies;
        },
        error: (err) => {
          this.error = 'Failed to load companies: ' + err.status;
        },
      });
  }

  createInternship(): void {
      if (this.internshipForm.valid) {
        this.loading = true;
        this.error = null;
        const newInternship: CreateUpdateInternshipDto = this.internshipForm.value;
        newInternship.studentId = this.student?.id!
        this.studentSelfService
          .createOwnInternship(newInternship)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message = 'Internship created successfully!';
              this.loading = false;
              this.internshipForm.reset();
            },
            error: (err) => {
              this.error = 'Failed to create internship:' + err.status;
              this.loading = false;
            },
          });
      } else {
        this.error = 'Please fill in all required fields correctly.';
      }
  }
}
