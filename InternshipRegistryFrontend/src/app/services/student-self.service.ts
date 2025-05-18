import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DocumentDto } from '../models/document-dto.model';
import { InternshipDto } from '../models/internship.model';
import { CreateUpdateInternshipDto } from '../models/internship-create-update-dto.model';
import { StudentDto } from '../models/student-dto.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DateConversionService } from './date-conversion.service';
import { InternshipDateConversionModel } from '../models/internship-date-conversion.model';

@Injectable({
  providedIn: 'root'
})
export class StudentSelfService {

  private apiUrl = `${environment.apiUrl}/student/me`;

  constructor(private http: HttpClient, private conversion : DateConversionService) { }

  getOwnStudentDetails(): Observable<StudentDto> {
    return this.http.get<StudentDto>(this.apiUrl, { withCredentials: true });
  }

  // GET methods: Convert string dates from backend (InternshipDateConversionModel)
  // to Date objects for frontend (InternshipDto)
  getOwnInternship(): Observable<InternshipDto> {
    return this.http.get<InternshipDateConversionModel>(`${this.apiUrl}/internship`, { withCredentials: true }).pipe(
      map(model => this.conversion.conversionModelToInternship(model))
    );
  }

  // POST/PUT methods: Convert Date objects from frontend (CreateUpdateInternshipDto)
  // to string dates for backend (CreateUpdateInternshipDateConversionModel)
  updateOwnInternship(internship: CreateUpdateInternshipDto): Observable<InternshipDto> {
    const convertedInternship = this.conversion.CreateUpdateInternshipToConversionModel(internship);
    return this.http.put<InternshipDateConversionModel>(`${this.apiUrl}/internship`, internship, { withCredentials: true }).pipe(
          map(model => this.conversion.conversionModelToInternship(model))
    );
  }

  createOwnInternship(internship: CreateUpdateInternshipDto): Observable<InternshipDto> {
    return this.http.post<InternshipDateConversionModel>(`${this.apiUrl}/internship`, internship, { withCredentials: true }).pipe(
          map(model => this.conversion.conversionModelToInternship(model))
    );
  }

  getAllDocumentsByStudent(): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(`${this.apiUrl}/internship/documents`, { withCredentials: true });
  }

  sendDocumentToStudent(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/internship/documents/${documentId}/download`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  createDocument(file: File): Observable<DocumentDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<DocumentDto>(this.apiUrl, formData, { withCredentials: true });
  }

  deleteDocumentByIdByUser(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/internship/documents/${documentId}`, { withCredentials: true });
  }
}
