import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../models/user-dto.model';
import { UpdateUserDto } from '../models/user-update-dto';
import { UpdateUserPasswordDto } from '../models/user-password-update-dto';

@Injectable({
  providedIn: 'root'
})
export class UserSelfService {

  private apiUrl = `${environment.apiUrl}/users/me`;

  constructor(private http: HttpClient) { }

  getOwnDetails(): Observable<UserDto> {
    return this.http.get<UserDto>(this.apiUrl, { withCredentials: true });
  }

  updateUsername(user: UpdateUserDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.apiUrl}/username`, user, { withCredentials: true });
  }

  updatePassword(passwordDto: UpdateUserPasswordDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.apiUrl}/password`, passwordDto, { withCredentials: true });
  }

  isAuthenticatedUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth`, { withCredentials: true });
  }
}
