import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CompanyDto } from '../models/company-dto.model';
import { CreateUpdateCompanyDto } from '../models/company-create-update-dto.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) { }

   getAllCompanies(): Observable<CompanyDto[]> {
    return this.http.get<CompanyDto[]>(this.apiUrl, { withCredentials: true });
  }

  getCompanyById(id: number): Observable<CompanyDto> {
    return this.http.get<CompanyDto>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getCompanyByName(companyName: string): Observable<CompanyDto> {
    return this.http.get<CompanyDto>(`${this.apiUrl}/name/${companyName}`, { withCredentials: true });
  }

  updateCompany(id: number, company: CreateUpdateCompanyDto): Observable<CompanyDto> {
    return this.http.put<CompanyDto>(`${this.apiUrl}/${id}`, company, { withCredentials: true });
  }

  createCompany(company: CreateUpdateCompanyDto): Observable<CompanyDto> {
    return this.http.post<CompanyDto>(this.apiUrl, company, { withCredentials: true });
  }

  deleteCompanyById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
