import { Component, OnInit } from '@angular/core';
import { CreateUserDto } from '../../../models/user-create-dto';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { Role } from '../../../models/role.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { UserDto } from '../../../models/user-dto.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {

  userForm: FormGroup;
  roles = [Role.ADMIN, Role.COORDINATOR];
  message: string = '';

  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    protected router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
      role: [Role.STUDENT, Validators.required] // Default role to STUDENT
    });
  }

  ngOnInit(): void {
    // Optionally, if you have a pre-fill scenario, you can load data here
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const newUser: CreateUserDto = this.userForm.value;
      this.userService.createUser(newUser).subscribe({
        next: (createdUser: UserDto) => {
          this.showMessage(`User '${createdUser.username}' created successfully with ID: ${createdUser.id}`);
          this.userForm.reset({ role: Role.STUDENT }); // Reset form, keep default role
        },
        error: (error: HttpErrorResponse) => {
          this.showError('Failed to create user: ' + error.status + ' - ' + (error.error?.message || 'Unknown error'));
          console.error('Error creating user:', error);
        }
      });
    } else {
      this.showError('Please fill in all required fields correctly.');
      this.userForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  private showMessage(msg: string): void {
    this.message = msg;
    this.isError = false;
    setTimeout(() => this.message = '', 3000);
  }

  private showError(msg: string): void {
    this.message = msg;
    this.isError = true;
    setTimeout(() => this.message = '', 3000);
  }
}
