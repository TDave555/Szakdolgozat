import { Company } from "./company.model";
import { Document } from "./document.model";
import { Student } from "./student.model";

export interface Internship {
  id: number;
  startDate: Date
  endDate?: Date;
  weeks?: number;
  companyInstructor?: string;
  grade?: number;
  certificateDate?: Date;
  completed: boolean;
  student: Student;
  company: Company;
  documents?: Document[];
}
