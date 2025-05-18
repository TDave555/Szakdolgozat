import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateUpdateCompanyDto } from '../../../models/company-create-update-dto.model';
import { Subject, takeUntil } from 'rxjs';
import { CompanyDto } from '../../../models/company-dto.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit, OnDestroy {
  company: CompanyDto | null = null;
  companyId: number | null = null;
  companyForm: FormGroup;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      active: [true, Validators.required] // Default value
    });
  }

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.companyId) {
      this.loadCompanyDetails(this.companyId);
    } else {
      this.error = 'Company ID is required to view details.';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCompanyDetails(id: number): void {
    this.loading = true;
    this.error = null;
    this.companyService.getCompanyById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (company: CompanyDto) => {
        this.company = company;
        this.companyForm.patchValue({
          name: company.name,
          address: company.address,
          active: company.active
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load company details.';
        this.loading = false;
      }
    });
  }

  updateCompany(): void {
    if (this.companyForm.valid && this.companyId) {
      const updatedCompany: CreateUpdateCompanyDto = this.companyForm.value;
      this.companyService.updateCompany(this.companyId, updatedCompany).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.router.navigate(['/companies']); // Go back to company list
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message || 'Failed to update company.';
        }
      });
    } else {
      this.error = 'Please fill in the form correctly.';
    }
  }

  goBackToList(): void {
    this.router.navigate(['/companies']);
  }
}
