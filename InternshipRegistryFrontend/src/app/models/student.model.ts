import { User } from "./user.model";

export interface Student extends User {
  name: string;
  neptuncode: string;
  specialization: string;
  internshipId?: number;
}
