import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../../services/student.service';
import { CreateStudentDto } from '../../../models/student-create-dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-student-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.css'
})
export class StudentCreateComponent implements OnInit, OnDestroy {
  studentForm: FormGroup;
  message: string | null = null;
  error: string | null = null;
  loading = false;
    private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      neptuncode: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6}$/)]], // Example pattern
      specialization: ['', Validators.required]
    });
  }

  ngOnInit(): void {}
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

  createStudent(): void {
    if (this.studentForm.valid) {
      this.loading = true;
      this.error = null;

      const formData = this.studentForm.value;

      const neptuncode = formData.neptuncode as string;
      const name = formData.name as string;
      const specialization = formData.specialization as string;

      const username = neptuncode.toUpperCase();

      const firstName = name.split(' ')[0];
      const password = firstName + neptuncode.toUpperCase();

      const newStudent: CreateStudentDto = {
        name: formData.name,
        neptuncode: formData.neptuncode.toUpperCase(),
        specialization: formData.specialization,
        username: username,
        password: password
      };

      this.studentService.createStudent(newStudent).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.message = 'Student created successfully!';
          this.loading = false;
          this.studentForm.reset();

        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message || 'Failed to create student.';
          this.loading = false;
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
