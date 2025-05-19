import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UpdateStudentDto } from '../../../models/student-update-dto';
import { StudentDto } from '../../../models/student-dto.model';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit, OnDestroy {
  student: StudentDto | null = null;
  neptuncode: string | null = null;
  studentForm: FormGroup;
  loading = true;
  error: string | null = null;
    private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      neptuncode: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6}$/)]], // Example pattern
      specialization: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.neptuncode = this.route.snapshot.paramMap.get('neptuncode');
    if (this.neptuncode) {
      this.loadStudentDetails(this.neptuncode);
    } else {
      this.error = 'Neptun code is required to view student details.';
      this.loading = false;
    }
  }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

  loadStudentDetails(neptuncode: string): void {
    this.loading = true;
    this.error = null;
    this.studentService.getStudentByNeptuncode(neptuncode).pipe(takeUntil(this.destroy$)).subscribe({
      next: (student: StudentDto) => {
        this.student = student;
        this.studentForm.patchValue({
          name: student.name,
          neptuncode: student.neptuncode,
          specialization: student.specialization
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load student details.';
        this.loading = false;
      }
    });
  }

  updateStudent(): void {
    if (this.studentForm.valid && this.student) {
      const updatedStudent: UpdateStudentDto = this.studentForm.value;
      this.studentService.updateStudent(this.student.id, updatedStudent).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message || 'Failed to update student.';
        }
      });
    } else {
      this.error = 'Please fill in the form correctly.';
    }
  }

  goBackToList(): void {
    this.router.navigate(['/students/list']);
  }
}
