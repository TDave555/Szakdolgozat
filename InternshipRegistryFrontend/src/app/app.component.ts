import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InternshipRegistryFrontend';
  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    this.cookieService.deleteAll('/', 'localhost');

  }
}
