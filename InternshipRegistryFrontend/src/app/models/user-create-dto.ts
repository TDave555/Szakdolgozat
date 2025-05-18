import { Role } from "./role.enum";

export interface CreateUserDto {
  username: string;
  password: string;
  role: Role;
}
