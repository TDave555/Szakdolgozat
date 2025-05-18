import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ RouterLink, CommonModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(protected authService: AuthService, private router  : Router) { }

  currentUser: string | null = null;

  ngOnInit() {
    this.authService.userName$.subscribe(userName => {
      this.currentUser = userName;
    });
  }

}
