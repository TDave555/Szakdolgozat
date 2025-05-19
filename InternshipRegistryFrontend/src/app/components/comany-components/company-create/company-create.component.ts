import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateUpdateCompanyDto } from '../../../models/company-create-update-dto.model';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.css'
})
export class CompanyCreateComponent implements OnInit, OnDestroy {
  companyForm: FormGroup;
  message: string | null = null;
  error: string | null = null;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      active: [true, Validators.required] // Default value
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createCompany(): void {
    if (this.companyForm.valid) {
      this.loading = true;
      this.error = null;
      const newCompany: CreateUpdateCompanyDto = this.companyForm.value;
      this.companyService.createCompany(newCompany).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.message = 'Company created successfully!';
          this.loading = false;
          this.companyForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message || 'Failed to create company.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Please fill in the form correctly.';
    }
  }

  goBackToList(): void {
    this.router.navigate(['/companies/list']);
  }
}
