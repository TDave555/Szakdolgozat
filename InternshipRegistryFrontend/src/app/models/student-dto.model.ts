import { UserDto } from "./user-dto.model";

export interface StudentDto extends UserDto {
  name: string;
  neptuncode: string;
  specialization: string;
  internshipId?: number;
}
