import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDto } from '../../../models/user-dto.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../../models/role.enum';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdateUserDto } from '../../../models/user-update-dto';
import { UpdateUserPasswordDto } from '../../../models/user-password-update-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit, OnDestroy {

  user: UserDto | null = null;
  usernameParam: string | null = null;

  usernameForm: FormGroup;
  passwordForm: FormGroup;
  roleForm: FormGroup;

  roles: Role[] = [Role.ADMIN, Role.COORDINATOR, Role.STUDENT]; // For role dropdown

  message: string = '';
  isError: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Initialize forms
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(25)]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.min(6), Validators.maxLength(25)]]
    });

    this.roleForm = this.fb.group({
      role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.usernameParam = params.get('username');
      if (this.usernameParam) {
        this.loadUserDetails(this.usernameParam);
      } else {
        this.showError('User username not provided in URL.');
        this.router.navigate(['/users']); // Redirect if no username param
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserDetails(username: string): void {
    this.userService.getUserByUsername(username).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: UserDto) => {
        this.user = user;
        // Populate forms with current user data for editing
        this.usernameForm.patchValue({ username: user.username });
        this.roleForm.patchValue({ role: user.role });
      },
      error: (error: HttpErrorResponse) => {
        this.showError(`Failed to load user details: ${error.statusText || 'Unknown error'}`);
        console.error('Error loading user details:', error);
        this.router.navigate(['/users']); // Go back to list on error
      }
    });
  }

  updateUsername(): void {
    if (this.usernameForm.valid && this.user) {
      const newUsername = this.usernameForm.value.username;
      const updateUserDto: UpdateUserDto = {
        username: newUsername,
        role: this.user.role // Keep the existing role
      };

      this.userService.updateUsername(this.user.username, updateUserDto).pipe(takeUntil(this.destroy$)).subscribe({
        next: (updatedUser: UserDto) => {
          this.showMessage('Username updated successfully!');
          this.user = updatedUser; // Update the displayed user data
          this.router.navigate(['/users/details', updatedUser.username]); // Navigate to new URL if username changed
        },
        error: (error: HttpErrorResponse) => {
          this.showError(`Failed to update username: ${error.error?.message || error.statusText}`);
          console.error('Error updating username:', error);
        }
      });
    } else {
      this.showError('Please enter a valid username.');
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid && this.user) {
      const updatePasswordDto: UpdateUserPasswordDto = {
        password: this.passwordForm.value.password
      };

      this.userService.updateUserPassword(this.user.username, updatePasswordDto).pipe(takeUntil(this.destroy$)).subscribe({
        next: (updatedUser: UserDto) => {
          this.showMessage('Password updated successfully!');
          this.passwordForm.reset(); // Clear password field after successful update
          // Note: Password update might invalidate session. Consider logging out or prompting for re-login
        },
        error: (error: HttpErrorResponse) => {
          this.showError(`Failed to update password: ${error.error?.message || error.statusText}`);
          console.error('Error updating password:', error);
        }
      });
    } else {
      this.showError('Please enter a valid password (min 6, max 25 characters).');
    }
  }

  updateRole(): void {
    if (this.roleForm.valid && this.user) {
      const newRole = this.roleForm.value.role;
      const updateUserDto: UpdateUserDto = {
        username: this.user.username, // Keep the existing username
        role: newRole
      };

      this.userService.updateUserRole(this.user.username, updateUserDto).pipe(takeUntil(this.destroy$)).subscribe({
        next: (updatedUser: UserDto) => {
          this.showMessage('User role updated successfully!');
          this.user = updatedUser; // Update the displayed user data
        },
        error: (error: HttpErrorResponse) => {
          this.showError(`Failed to update role: ${error.error?.message || error.statusText}`);
          console.error('Error updating role:', error);
        }
      });
    } else {
      this.showError('Please select a valid role.');
    }
  }

  goBackToList(): void {
    this.router.navigate(['/users']);
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
