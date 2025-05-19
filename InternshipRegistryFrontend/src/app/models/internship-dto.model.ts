import { CompanyDto } from "./company-dto.model";
import { DocumentDto } from "./document-dto.model";
import { StudentDto } from "./student-dto.model";

export interface InternshipDto {
  id: number;
  startDate: Date
  endDate?: Date;
  weeks?: number;
  companyInstructor?: string;
  grade?: number;
  certificateDate?: Date;
  completed: boolean;
  student: StudentDto;
  company: CompanyDto;
}
