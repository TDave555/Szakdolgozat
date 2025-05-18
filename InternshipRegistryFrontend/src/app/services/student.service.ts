import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StudentDto } from '../models/student-dto.model';
import { UpdateStudentDto } from '../models/student-update-dto';
import { CreateStudentDto } from '../models/student-create-dto';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) { }

  getAllStudents(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(this.apiUrl, { withCredentials: true });
  }

  getStudentById(id: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.apiUrl}/id/${id}`, { withCredentials: true });
  }

  getStudentByNeptuncode(neptuncode: string): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.apiUrl}/${neptuncode}`, { withCredentials: true });
  }

  getStudentByUsername(username: string): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.apiUrl}/username/${username}`, { withCredentials: true });
  }

  updateStudent(id: number, student: UpdateStudentDto): Observable<StudentDto> {
    return this.http.put<StudentDto>(`${this.apiUrl}/${id}`, student, { withCredentials: true });
  }

  createStudent(student: CreateStudentDto): Observable<StudentDto> {
    return this.http.post<StudentDto>(this.apiUrl, student, { withCredentials: true });
  }

  deleteStudentById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
