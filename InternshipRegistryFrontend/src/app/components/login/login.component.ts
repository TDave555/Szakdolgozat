import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(private authService: AuthService, private router  : Router) { }

    ngOnInit() {
      this.authService.isAuthenticated().subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['home']);
        }
      });
    }

    onSubmit() {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          console.log("Login successful!");
          this.router.navigate(['home']);
        },
        error: (err: any) => {
          console.error("Login failed", err);
          this.errorMessage = "Invalid username or password.";
        }
      });
    }
}
