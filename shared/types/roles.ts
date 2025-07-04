import { User } from "./user";

export interface Role {
  id?: string;
  name: string;
  description?: string;
  users?: User[];
}

// Gardons l'enum UserRole existant
export enum UserRole {
  ADMIN = "admin",
  ASSOCIATION_MANAGER = "associationManager",
  USER = "user",
}

export enum RoleEnum {
  SUPER_ADMIN = "SuperAdmin",
  ASSOCIATION_MANAGER = "AssociationManager",
  EVENTS_MANAGER = "EventsManager",
}

export enum Permissions {
  MEDIA_CREATE = "media:create",
  MEDIA_READ = "media:read",
  MEDIA_UPDATE = "media:update",
  MEDIA_DELETE = "media:delete",
  MEDIA_LIST = "media:list",
}

export const RolePermissions: Record<RoleEnum, Permissions[]> = {
  [RoleEnum.SUPER_ADMIN]: [],
  [RoleEnum.ASSOCIATION_MANAGER]: [
    Permissions.MEDIA_CREATE,
    Permissions.MEDIA_READ,
    Permissions.MEDIA_UPDATE,
  ],
  [RoleEnum.EVENTS_MANAGER]: [
    Permissions.MEDIA_CREATE,
    Permissions.MEDIA_READ,
    Permissions.MEDIA_UPDATE,
  ],
};
