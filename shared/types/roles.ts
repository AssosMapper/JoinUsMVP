import { Permission } from './permission';
import { User } from "./user";

export interface Role {
  id?: number;
  name: string;
  description?: string;
  permissions: Permission[];
  users: User[];
}

// Gardons l'enum UserRole existant
export enum UserRole {
  ADMIN = 'admin',
  ASSOCIATION_MANAGER = 'associationManager',
  USER = 'user'
}

export enum RoleEnum {
  SUPER_ADMIN = 'SuperAdmin',
  ASSOCIATION_MANAGER = 'AssociationManager',
  EVENTS_MANAGER = 'EventsManager'
}
