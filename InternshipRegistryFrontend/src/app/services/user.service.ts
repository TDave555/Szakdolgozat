import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserDto } from '../models/user-create-dto';
import { UpdateUserDto } from '../models/user-update-dto';
import { UpdateUserPasswordDto } from '../models/user-password-update-dto';
import { UserDto } from '../models/user-dto.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl, { withCredentials: true });
  }

  getUserByUsername(username: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${username}`, { withCredentials: true });
  }

  updateUsername(username: string, user: UpdateUserDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.apiUrl}/${username}/username`, user, { withCredentials: true });
  }

  updateUserPassword(username: string, passwordDto: UpdateUserPasswordDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.apiUrl}/${username}/password`, passwordDto, { withCredentials: true });
  }

  updateUserRole(username: string, user: UpdateUserDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.apiUrl}/${username}/role`, user, { withCredentials: true });
  }

  createUser(user: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.apiUrl, user, { withCredentials: true });
  }

  deleteUserByUsername(username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${username}`, { withCredentials: true });
  }
}
