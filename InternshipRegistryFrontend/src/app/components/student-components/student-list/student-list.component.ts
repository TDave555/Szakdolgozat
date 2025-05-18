import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentDto } from '../../../models/student-dto.model';
import { StudentService } from '../../../services/student.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit, OnDestroy {
  students: StudentDto[] = [];
  loading = true;
  error: string | null = null;
    private destroy$ = new Subject<void>();

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

  loadStudents(): void {
    this.loading = true;
    this.error = null;
    this.studentService.getAllStudents().pipe(takeUntil(this.destroy$)).subscribe({
      next: (students: StudentDto[]) => {
        this.students = students;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load students';
        this.loading = false;
      }
    });
  }

  goToDetails(neptuncode: string): void {
    this.router.navigate(['/students', neptuncode]);
  }

  goToCreate(): void {
    this.router.navigate(['/students/create']);
  }
}
