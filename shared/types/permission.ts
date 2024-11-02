import { Role } from "./roles";

export interface Permission {
  id?: number;
  permission: string;
  roles: Role[];
}

