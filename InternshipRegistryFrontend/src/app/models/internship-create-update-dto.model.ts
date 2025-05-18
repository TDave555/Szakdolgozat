export interface CreateUpdateInternshipDto {
  startDate: Date;
  endDate?: Date;
  weeks: number;
  companyInstructor?: string;
  grade?: number;
  certificateDate?: Date;
  completed: boolean;
  studentId: number;
  companyId: number;
}
