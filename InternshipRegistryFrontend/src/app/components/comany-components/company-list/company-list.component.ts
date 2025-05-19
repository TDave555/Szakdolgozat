import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyDto } from '../../../models/company-dto.model';
import { Subject, takeUntil } from 'rxjs';
import { CompanyService } from '../../../services/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-list',
  imports: [CommonModule],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent implements OnInit, OnDestroy {
  companies: CompanyDto[] = [];
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private companyService: CompanyService, private router: Router) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCompanies(): void {
    this.loading = true;
    this.error = null;
    this.companyService.getAllCompanies().pipe(takeUntil(this.destroy$)).subscribe({
      next: (companies: CompanyDto[]) => {
        this.companies = companies.sort((a, b) => b.id - a.id);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load companies';
        this.loading = false;
      }
    });
  }

  editCompany(id: number): void {
    this.router.navigate(['/companies/details', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/companies/create']);
  }
}
