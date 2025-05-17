import { Role } from "./role.enum";

export interface User {
  id: number;
  username: string;
  role: Role;
}
