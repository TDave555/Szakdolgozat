import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSelfService } from '../../services/user-self.service';
import { StudentSelfService } from '../../services/student-self.service';
import { UserDto } from '../../models/user-dto.model';
import { StudentDto } from '../../models/student-dto.model';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdateUserDto } from '../../models/user-update-dto';
import { UpdateUserPasswordDto } from '../../models/user-password-update-dto';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: UserDto | null = null;
  student: StudentDto | null = null;
  isStudent: boolean = false;

  usernameForm: FormGroup;
  passwordForm: FormGroup;

  message: string = '';
  isError: boolean = false;

  constructor(
    private userSelfService: UserSelfService,
    private studentSelfService: StudentSelfService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(25)]]
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userSelfService.getOwnDetails().subscribe({
      next: (user: UserDto) => {
        this.user = user;
        this.usernameForm.patchValue({ username: user.username });
        if (user.role === 'STUDENT') {
          this.isStudent = true;
          this.studentSelfService.getOwnStudentDetails().subscribe({
            next: (student: StudentDto) => {
              this.student = student;
            },
            error: (error: HttpErrorResponse) => {
              this.showError('Failed to load student details: ' + error.status);
              console.error('Error loading student details:', error);
            }
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.showError('Failed to load user details: ' + error.status);
        console.error('Error loading user details:', error);
      }
    });
  }

  updateUsername(): void {
    if (this.usernameForm.valid && this.user) {
      const updateUserDto: UpdateUserDto = {
        username: this.usernameForm.value.username,
        role: this.user.role // Role should remain unchanged
      };
      this.userSelfService.updateUsername(updateUserDto).subscribe({
        next: (updatedUser: UserDto) => {
          this.user = updatedUser; // Update user object with new data
          localStorage.setItem('username', updatedUser.username); // Update username in local storage
          this.showMessage('Username updated successfully!\nYou will need to log in again.');
          setTimeout(() => {
            this.authService.logout(); // Log out the user after username change
          }, 3000); // Wait for 3 seconds before logging out
        },
        error: (error: HttpErrorResponse) => {
          this.showError('Failed to update username, httpError:' + error.status);
          console.error('Error updating username:', error);
        }
      });

    } else {
      this.showError('Please enter a valid username.');
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const updatePasswordDto: UpdateUserPasswordDto = {
        password: this.passwordForm.value.password
      };
      this.userSelfService.updatePassword(updatePasswordDto).subscribe({
        next: (updatedUser: UserDto) => {
          this.passwordForm.reset(); // Clear password field after successful update
          this.showMessage('Password updated successfully!\nYou will need to log in again.');
          setTimeout(() => {
            this.authService.logout(); // Log out the user after username change
          }, 3000); // Wait for 3 seconds before logging out
        },
        error: (error: HttpErrorResponse) => {
          this.showError('Failed to update password, httpError:' + error.status);
          console.error('Error updating password:', error);
        }
      });
    } else {
      this.showError('Please enter a valid password (min 6, max 25 characters).');
    }
  }

  private showMessage(msg: string): void {
    this.message = msg;
    this.isError = false;
    setTimeout(() => this.message = '', 3000); // Clear message after 3 seconds
  }

  private showError(msg: string): void {
    this.message = msg;
    this.isError = true;
    setTimeout(() => this.message = '', 5000); // Clear error message after 5 seconds
  }
}
