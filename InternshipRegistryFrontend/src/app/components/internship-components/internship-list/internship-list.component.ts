import { Component, OnDestroy, OnInit } from '@angular/core';
import { InternshipDto } from '../../../models/internship-dto.model';
import { Subject, takeUntil } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from '../../../services/internship.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-internship-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './internship-list.component.html',
  styleUrl: './internship-list.component.css'
})
export class InternshipListComponent implements OnInit, OnDestroy {
  internships: InternshipDto[] = [];
  loading = true;
  error: string | null = null;
  // Sorting and Filtering
  sortField: string = 'startDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private internshipService: InternshipService
  ) {}

  ngOnInit(): void {
    this.loadInternships();
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInternships(): void {
    this.loading = true;
    this.error = null;

    const yearparam = this.route.snapshot.paramMap.get('year');
    const completedparam = this.route.snapshot.paramMap.get('completed');

    if (yearparam != 'all' && completedparam == 'all') {
      const year = Number(yearparam);
      this.internshipService.getAllInternshipsByYear(year).pipe(takeUntil(this.destroy$)).subscribe({
          next: (internships: InternshipDto[]) => {
          this.internships = internships.sort((a, b) => b.id - a.id);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load internships.';
          this.loading = false;
        }
      });
    } else if (yearparam == 'all' && completedparam != 'all') {
      const completed = completedparam === 'true';
      this.internshipService.getAllInternshipsByCompletion(completed).pipe(takeUntil(this.destroy$)).subscribe({
        next: (internships: InternshipDto[]) => {
          this.internships = internships.sort((a, b) => b.id - a.id);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load internships.';
          this.loading = false;
        }
      });
    } else if (yearparam != 'all' && completedparam != 'all') {
      const year = Number(yearparam);
      const completed = completedparam === 'true';
      this.internshipService.getAllInternshipsByYearAndCompletion(year, completed).pipe(takeUntil(this.destroy$)).subscribe({
        next: (internships: InternshipDto[]) => {
          this.internships = internships.sort((a, b) => b.id - a.id);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load internships.';
          this.loading = false;
        }
      });
    } else {
      this.internshipService.getAllInternships().pipe(takeUntil(this.destroy$)).subscribe({
        next: (internships: InternshipDto[]) => {
          this.internships = internships.sort((a, b) => b.id - a.id);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load internships.';
          this.loading = false;
        }
      });
    }
  }

  goToDetails(id: number): void {
    this.router.navigate(['/internships/details', id]);
  }

}
