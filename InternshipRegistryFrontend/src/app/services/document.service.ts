import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DocumentDto } from '../models/document-dto.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

   private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  getAllDocumentsByInternshipId(internshipId: number): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(`${this.apiUrl}/byinternship/${internshipId}`, { withCredentials: true });
  }

  getDocumentById(id: number): Observable<DocumentDto> {
    return this.http.get<DocumentDto>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  uploadDocument(file: File, internshipId: number): Observable<DocumentDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('internshipId', internshipId.toString());

    return this.http.post<DocumentDto>(this.apiUrl, formData, { withCredentials: true });
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  deleteDocumentById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
