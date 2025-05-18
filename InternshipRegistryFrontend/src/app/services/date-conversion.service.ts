import { Injectable } from '@angular/core';
import { InternshipDto } from '../models/internship.model';
import { InternshipDateConversionModel } from '../models/internship-date-conversion.model';
import { CreateUpdateInternshipDateConversionModel } from '../models/internship-create-update-date-conversion.model';
import { CreateUpdateInternshipDto } from '../models/internship-create-update-dto.model';

@Injectable({
  providedIn: 'root'
})
export class DateConversionService {

  public conversionModelToInternship(model : InternshipDateConversionModel) : InternshipDto {
    return {
      id: model.id,
      startDate: new Date(model.startDate),
      endDate: model.endDate ? new Date(model.endDate) : undefined,
      weeks: model.weeks,
      companyInstructor: model.companyInstructor,
      grade: model.grade,
      certificateDate: model.certificateDate ? new Date(model.certificateDate) : undefined,
      completed: model.completed,
      student: model.student,
      company: model.company
    };
  }

  public CreateUpdateInternshipToConversionModel(dto : CreateUpdateInternshipDto) : CreateUpdateInternshipDateConversionModel {
    return {
      startDate: dto.startDate.toISOString().slice(0, 10),
      endDate: dto.endDate ? dto.endDate.toISOString().slice(0, 10) : null,
      weeks: dto.weeks,
      companyInstructor: dto.companyInstructor,
      grade: dto.grade,
      certificateDate: dto.certificateDate ? dto.certificateDate.toISOString().slice(0, 10) : null,
      completed: dto.completed,
      studentId: dto.studentId,
      companyId: dto.companyId
    };
  }

}
