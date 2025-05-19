import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDto } from '../../../models/user-dto.model';
import { Role } from '../../../models/role.enum';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {

  users: UserDto[] = [];
  message: string = '';
  isError: boolean = false;
  Role = Role;

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: UserDto[]) => {
        this.users = users.sort((a, b) => b.id - a.id);
      },
      error: (error: HttpErrorResponse) => {
        this.showError('Failed to fetch users: ' + error.status);
        console.error('Error fetching users:', error);
      }
    });
  }

  editUser(username: string): void {
    this.router.navigate(['/users/details', username]);
  }


  goToCreate(): void {
    this.router.navigate(['/users/create']);
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
