import { Role } from './role.enum';

export interface UpdateUserDto {
  username: string;
  role: Role;
}
