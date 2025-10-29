import { Role } from "./roles";

export interface Permission {
  id?: string;
  permission: string;
  roles: Role[];
}
