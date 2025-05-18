import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../../models/user-dto.model';
import { Role } from '../../../models/role.enum';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users: UserDto[] = [];
  message: string = '';
  isError: boolean = false;
  Role = Role; // Expose the Role enum to the template

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: UserDto[]) => {
        this.users = users;
      },
      error: (error: HttpErrorResponse) => {
        this.showError('Failed to fetch users: ' + error.status);
        console.error('Error fetching users:', error);
      }
    });
  }

  // Updated to navigate to the user-detail component using the username param
  viewUser(username: string): void {
    this.router.navigate(['/users/details', username]);
  }

  // Edit action will also navigate to the detail page for editing
  editUser(username: string): void {
    this.router.navigate(['/users/details', username]);
  }

  deleteUser(username: string): void {
    if (confirm(`Are you sure you want to delete user ${username}?`)) {
      this.userService.deleteUserByUsername(username).subscribe({
        next: () => {
          this.showMessage(`User ${username} deleted successfully.`);
          this.getAllUsers(); // Refresh the list
        },
        error: (error: HttpErrorResponse) => {
          this.showError('Failed to delete user: ' + error.status);
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  createNewUser(): void {
    this.router.navigate(['/users/create']); // Assuming a route like /users/create for creating a new user
  }

  private showMessage(msg: string): void {
    this.message = msg;
    this.isError = false;
    setTimeout(() => this.message = '', 3000);
  }

  private showError(msg: string): void {
    this.message = msg;
    this.isError = true;
    setTimeout(() => this.message = '', 5000);
  }
}
