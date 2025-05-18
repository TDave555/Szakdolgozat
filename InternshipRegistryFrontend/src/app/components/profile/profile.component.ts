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

  // Global message for initial load or general issues
  globalMessage: string = '';
  isGlobalError: boolean = false;

  // Messages for username update form
  usernameMessage: string = '';
  isUsernameError: boolean = false;

  // Messages for password update form
  passwordMessage: string = '';
  isPasswordError: boolean = false;

  constructor(
    private userSelfService: UserSelfService,
    private studentSelfService: StudentSelfService,
    private fb: FormBuilder
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
              this.showGlobalError('Failed to load student details: ' + error.message);
              console.error('Error loading student details:', error);
            }
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.showGlobalError('Failed to load user details: ' + error.message);
        console.error('Error loading user details:', error);
      }
    });
  }

  updateUsername(): void {
    this.clearMessages('username'); // Clear previous messages
    if (this.usernameForm.valid && this.user) {
      const updateUserDto: UpdateUserDto = {
        username: this.usernameForm.value.username,
        role: this.user.role
      };
      this.userSelfService.updateUsername(updateUserDto).subscribe({
        next: (updatedUser: UserDto) => {
          this.user = updatedUser;
          this.showUsernameMessage('Username updated successfully!');
        },
        error: (error: HttpErrorResponse) => {
          this.showUsernameError('Failed to update username: ' + error.error); // Assuming error.error has the message from Spring
          console.error('Error updating username:', error);
        }
      });
    } else {
      this.showUsernameError('Please enter a valid username.');
    }
  }

  updatePassword(): void {
    this.clearMessages('password'); // Clear previous messages
    if (this.passwordForm.valid) {
      const updatePasswordDto: UpdateUserPasswordDto = {
        password: this.passwordForm.value.password
      };
      this.userSelfService.updatePassword(updatePasswordDto).subscribe({
        next: (updatedUser: UserDto) => {
          this.user = updatedUser;
          this.showPasswordMessage('Password updated successfully!');
          this.passwordForm.reset(); // Clear password field after successful update
        },
        error: (error: HttpErrorResponse) => {
          this.showPasswordError('Failed to update password: ' + error.error); // Assuming error.error has the message from Spring
          console.error('Error updating password:', error);
        }
      });
    } else {
      this.showPasswordError('Please enter a valid password (min 6, max 25 characters).');
    }
  }

  private showGlobalMessage(msg: string): void {
    this.globalMessage = msg;
    this.isGlobalError = false;
    setTimeout(() => this.globalMessage = '', 3000);
  }

  private showGlobalError(msg: string): void {
    this.globalMessage = msg;
    this.isGlobalError = true;
    setTimeout(() => this.globalMessage = '', 5000);
  }

  private showUsernameMessage(msg: string): void {
    this.usernameMessage = msg;
    this.isUsernameError = false;
    setTimeout(() => this.usernameMessage = '', 3000);
  }

  private showUsernameError(msg: string): void {
    this.usernameMessage = msg;
    this.isUsernameError = true;
    setTimeout(() => this.usernameMessage = '', 5000);
  }

  private showPasswordMessage(msg: string): void {
    this.passwordMessage = msg;
    this.isPasswordError = false;
    setTimeout(() => this.passwordMessage = '', 3000);
  }

  private showPasswordError(msg: string): void {
    this.passwordMessage = msg;
    this.isPasswordError = true;
    setTimeout(() => this.passwordMessage = '', 5000);
  }

  private clearMessages(formType?: 'username' | 'password'): void {
    if (formType === 'username') {
      this.usernameMessage = '';
      this.isUsernameError = false;
    } else if (formType === 'password') {
      this.passwordMessage = '';
      this.isPasswordError = false;
    } else {
      // Clear all messages if no specific formType is provided
      this.globalMessage = '';
      this.isGlobalError = false;
      this.usernameMessage = '';
      this.isUsernameError = false;
      this.passwordMessage = '';
      this.isPasswordError = false;
    }
  }
}
