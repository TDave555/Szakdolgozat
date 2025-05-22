import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentDto } from '../../../models/student-dto.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyDto } from '../../../models/company-dto.model';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { InternshipService } from '../../../services/internship.service';
import { StudentService } from '../../../services/student.service';
import { CompanyService } from '../../../services/company.service';
import { CreateUpdateInternshipDto } from '../../../models/internship-create-update-dto.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-internship-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './internship-create.component.html',
  styleUrl: './internship-create.component.css'
})
export class InternshipCreateComponent implements OnInit, OnDestroy {
  internshipForm: FormGroup;
  students: StudentDto[] = [];
  companies: CompanyDto[] = [];
  message: string | null = null;
  error: string | null = null;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private internshipService: InternshipService,
    private studentService: StudentService,
    private companyService: CompanyService
  ) {
    this.internshipForm = this.fb.group({
      studentId: [null, Validators.required],
      companyId: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      weeks: [null, Validators.required],
      companyInstructor: [null],
      grade: [null],
      certificateDate: [null],
      completed: [false],
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCompanies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudents(): void {
    this.studentService
      .getAllStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (students: StudentDto[]) => {
          this.students = students;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load students.';
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
          this.error = err.message || 'Failed to load companies.';
        },
      });
  }

  createInternship(): void {
    if (this.internshipForm.valid) {
      this.loading = true;
      this.error = null;
      const newInternship: CreateUpdateInternshipDto = this.internshipForm.value;

      if (newInternship.grade !== null && newInternship.grade !== undefined) {
        newInternship.completed = true;
      }
      this.internshipService
        .createInternship(newInternship)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.message = 'Internship created successfully!';
            this.loading = false;
            this.internshipForm.reset();
          },
          error: (err) => {
            this.error = err.message || 'Failed to create internship.';
            this.loading = false;
          },
        });
    } else {
      this.error = 'Please fill in all required fields correctly.';
    }
  }
}
