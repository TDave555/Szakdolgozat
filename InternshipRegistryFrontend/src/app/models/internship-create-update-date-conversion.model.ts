export interface CreateUpdateInternshipDateConversionModel {
  startDate: string;
  endDate?: string| null;
  weeks: number;
  companyInstructor?: string;
  grade?: number;
  certificateDate?: string | null;
  completed: boolean;
  studentId: number;
  companyId: number;
}
