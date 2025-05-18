import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { filter, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'InternshipRegistryFrontend';
  showHeader: boolean = true;
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    this.routerSubscription = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showHeader = !event.urlAfterRedirects.includes('/login');
    });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
}
