import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  status: string;
  username: string;
  roles: string;
}

enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  COORDINATOR = 'ROLE_COORDINATOR',
  STUDENT = 'ROLE_STUDENT',
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userRolesSubject = new BehaviorSubject<UserRole[] | null>(null);
  private userNameSubject = new BehaviorSubject<string | null>(null);
  userRoles$ = this.userRolesSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  restoreSession(): void {
    const roles = localStorage.getItem('roles');
    const username = localStorage.getItem('username');
    if (roles && username) {
      const parsedRoles: UserRole[] = JSON.parse(roles);
      this.userRolesSubject.next(parsedRoles);
      this.userNameSubject.next(username);
    } else {
      this.isAuthenticated().subscribe(isAuth => {
        if (isAuth) {
          this.logout();
        }
      });
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/users/me/auth`, { withCredentials: true }).pipe(
      map(response => true),
      catchError(err => of(false))
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
        const rolesFromResponse: UserRole[] = response.roles.split(",")
        .map(role => {
          const mappedRole = Object.values(UserRole).find(userRole => userRole === role.trim());
          if (mappedRole === undefined) {
            console.warn(`Unknown role encountered: ${role}`);
          }
          return mappedRole;
        }).filter(role => role !== undefined);
        //developement console.log
        console.log('Login status:', response.status);
        console.log('Username: ', response.username, ', roles:', rolesFromResponse);
        localStorage.setItem('username', username);
        localStorage.setItem('roles', JSON.stringify(rolesFromResponse));
        this.userNameSubject.next(response.username);
        this.userRolesSubject.next(rolesFromResponse);
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/logout`, {}, { withCredentials: true })
    .subscribe({
      next: () => {
        console.log("User logged out successfully");
        localStorage.removeItem('username');
        localStorage.removeItem('roles');
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
