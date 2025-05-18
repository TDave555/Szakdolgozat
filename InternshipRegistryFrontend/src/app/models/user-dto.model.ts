import { Role } from "./role.enum";

export interface UserDto {
  id: number;
  username: string;
  role: Role;
}
