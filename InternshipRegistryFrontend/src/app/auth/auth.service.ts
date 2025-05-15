import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { UserRole } from '../models/user-role.enum';
import { environment } from '../../environments/environment';

interface LoginResponse {
  status: string;
  username: string;
  roles: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userRolesSubject = new BehaviorSubject<UserRole[] | null>(null);
  private userNameSubject = new BehaviorSubject<string | null>(null);
  userRoles$ = this.userRolesSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

   constructor(private http: HttpClient, private router: Router) {}

  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/users/me`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  isAdmin(): boolean {
     return !!this.userRolesSubject.getValue()?.includes(UserRole.ADMIN);
  }

  isCoordinator(): boolean {
    return !!this.userRolesSubject.getValue()?.includes(UserRole.COORDINATOR);
  }
  isStudent(): boolean {
    return !!this.userRolesSubject.getValue()?.includes(UserRole.STUDENT);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/login`,
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      }
    ).pipe(
      tap(response => {
        const userRoles: UserRole[] = response.roles.split(",")
        .map(role => {
          const mappedRole = Object.values(UserRole).find(userRole => userRole === role.trim());
          if (mappedRole === undefined) {
            console.warn(`Unknown role encountered: ${role}`);
          }
          return mappedRole;
        }).filter(role => role !== undefined);
        console.log('Login status:', response.status);
        console.log('Username: ', username, ', roles:', userRoles);
        this.userNameSubject.next(response.username);
        this.userRolesSubject.next(userRoles);
        const authenticated = this.isAuthenticated();
        console.log('Authenticated:', authenticated);
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/logout`, {}, { withCredentials: true })
    .subscribe({
      next: () => {
        console.log("User logged out successfully");
        this.userRolesSubject.next(null);
        this.userNameSubject.next(null);
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error("Logout failed", err);
      }
    });
  }

}
