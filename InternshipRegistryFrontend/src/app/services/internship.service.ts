import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { InternshipDto } from '../models/internship.model';
import { InternshipDateConversionModel } from '../models/internship-date-conversion.model';
import { CreateUpdateInternshipDto } from '../models/internship-create-update-dto.model';
import { DateConversionService } from './date-conversion.service';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  private apiUrl = `${environment.apiUrl}/internships`;

  constructor(private http: HttpClient, private conversion: DateConversionService) { }

  // GET methods: Convert string dates from backend (InternshipDateConversionModel)
  // to Date objects for frontend (InternshipDto)
  getAllInternships(): Observable<InternshipDto[]> {
    return this.http.get<InternshipDateConversionModel[]>(this.apiUrl, { withCredentials: true }).pipe(
      map(models => models.map(model => this.conversion.conversionModelToInternship(model)))
    );
  }

  getAllInternshipsByYear(year: number): Observable<InternshipDto[]> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<InternshipDateConversionModel[]>(this.apiUrl, { params, withCredentials: true }).pipe(
      map(models => models.map(model => this.conversion.conversionModelToInternship(model)))
    );
  }

  getAllInternshipsByCompletion(completed: boolean): Observable<InternshipDto[]> {
    const params = new HttpParams().set('completed', completed.toString());
    return this.http.get<InternshipDateConversionModel[]>(this.apiUrl, { params, withCredentials: true }).pipe(
      map(models => models.map(model => this.conversion.conversionModelToInternship(model)))
    );
  }

  getAllInternshipsByYearAndCompletion(year: number, completed: boolean): Observable<InternshipDto[]> {
    const params = new HttpParams()
      .set('completed', completed.toString())
      .set('year', year.toString());
    return this.http.get<InternshipDateConversionModel[]>(this.apiUrl, { params, withCredentials: true }).pipe(
      map(models => models.map(model => this.conversion.conversionModelToInternship(model)))
    );
  }

  getInternshipById(id: number): Observable<InternshipDto> {
    return this.http.get<InternshipDateConversionModel>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map(model => this.conversion.conversionModelToInternship(model))
    );
  }

  // POST/PUT methods: Convert Date objects from frontend (CreateUpdateInternshipDto)
  // to string dates for backend (CreateUpdateInternshipDateConversionModel)
  updateInternship(id: number, internship: CreateUpdateInternshipDto): Observable<InternshipDto> {
    const convertedInternship = this.conversion.CreateUpdateInternshipToConversionModel(internship);
    return this.http.put<InternshipDateConversionModel>(`${this.apiUrl}/${id}`, convertedInternship, { withCredentials: true }).pipe(
      map(model => this.conversion.conversionModelToInternship(model))
    );
  }

  createInternship(internship: CreateUpdateInternshipDto): Observable<InternshipDto> {
    const convertedInternship = this.conversion.CreateUpdateInternshipToConversionModel(internship);
    return this.http.post<InternshipDateConversionModel>(this.apiUrl, convertedInternship, { withCredentials: true }).pipe(
      map(model => this.conversion.conversionModelToInternship(model))
    );
  }

  deleteInternshipById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
