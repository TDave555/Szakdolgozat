import { CompanyDto } from "./company-dto.model";
import { DocumentDto } from "./document-dto.model";
import { StudentDto } from "./student-dto.model";

export interface InternshipDateConversionModel {
  id: number;
  startDate: string;
  endDate?: string | null;
  weeks?: number;
  companyInstructor?: string;
  grade?: number;
  certificateDate?: string | null;
  completed: boolean;
  student: StudentDto;
  company: CompanyDto;
}
